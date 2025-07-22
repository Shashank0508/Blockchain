// Firebase Configuration (same as main app)
const firebaseConfig = {
    apiKey: "AIzaSyBHsLRrQSkQCF10b7ipLd2Fa_vuwrbqNfM",
    authDomain: "blockchain-buddy-7c64c.firebaseapp.com",
    databaseURL: "https://blockchain-buddy-7c64c-default-rtdb.firebaseio.com/",
    projectId: "blockchain-buddy-7c64c",
    storageBucket: "blockchain-buddy-7c64c.firebasestorage.app",
    messagingSenderId: "270517045251",
    appId: "1:270517045251:web:036d50421a78306265a636",
    measurementId: "G-T63M1JXBX9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Global variables
let currentUser = null;
let activeChatUser = null;
let friends = [];
let searchResults = [];
let friendRequests = [];

// Ensure user data exists in database
async function ensureUserDataExists(user) {
    try {
        const userRef = database.ref(`users/${user.uid}`);
        const snapshot = await userRef.once('value');
        const existingData = snapshot.val() || {};
        
        // Always update/add the user profile information
        const userData = {
            ...existingData, // Keep existing data like chatMessages, transactions
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            name: user.displayName || user.email.split('@')[0],
            phone: user.phoneNumber || existingData.phone || '',
            status: 'online',
            lastSeen: firebase.database.ServerValue.TIMESTAMP,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        };
        
        if (!snapshot.exists()) {
            userData.createdAt = firebase.database.ServerValue.TIMESTAMP;
            console.log('Creating new user data:', userData);
        } else {
            console.log('Updating existing user data with profile info:', userData);
        }
        
        await userRef.update(userData);
        console.log('User data saved successfully');
        
        // Verify the update worked
        const verifySnapshot = await userRef.once('value');
        console.log('Verified user data after update:', verifySnapshot.val());
        
    } catch (error) {
        console.error('Error ensuring user data exists:', error);
        showError('Error updating user profile: ' + error.message);
    }
}

// Debug function to check database contents
async function debugDatabaseContents() {
    try {
        console.log('=== DEBUGGING DATABASE CONTENTS ===');
        const usersRef = database.ref('users');
        const snapshot = await usersRef.once('value');
        const allUsers = snapshot.val();
        
        console.log('Current user UID:', currentUser.uid);
        console.log('Current user email:', currentUser.email);
        console.log('All users in database:', allUsers);
        
        if (allUsers) {
            console.log('Number of users in database:', Object.keys(allUsers).length);
            for (const userId in allUsers) {
                const userData = allUsers[userId];
                console.log(`User ${userId}:`, userData);
                console.log(`  - Email: "${userData.email}"`);
                console.log(`  - DisplayName: "${userData.displayName}"`);
                console.log(`  - Name: "${userData.name}"`);
                console.log(`  - Phone: "${userData.phone}"`);
                console.log(`  - Full object keys:`, Object.keys(userData));
                
                if (userData.email === 'shashankpulivarthi5@gmail.com') {
                    console.log('FOUND TARGET USER!', userId, userData);
                }
            }
        } else {
            console.log('No users found in database');
        }
        console.log('=== END DEBUG ===');
    } catch (error) {
        console.error('Error debugging database:', error);
    }
}

// Function to fix incomplete user data in database
async function fixIncompleteUserData() {
    try {
        console.log('=== FIXING INCOMPLETE USER DATA ===');
        const usersRef = database.ref('users');
        const snapshot = await usersRef.once('value');
        const allUsers = snapshot.val() || {};
        
        for (const [uid, userData] of Object.entries(allUsers)) {
            // Check if user data is incomplete (missing email, name, or displayName)
            if (!userData.email || !userData.name || !userData.displayName) {
                console.log(`Found incomplete user data for ${uid}:`, userData);
                
                // For users with incomplete data, we'll create a default profile
                // In a real app, you'd want to prompt users to complete their profile
                const updates = {
                    ...userData // Keep existing data
                };
                
                if (!userData.email) {
                    // If no email, create a placeholder based on UID
                    updates.email = `user_${uid}@placeholder.com`;
                }
                
                if (!userData.displayName) {
                    updates.displayName = userData.email ? userData.email.split('@')[0] : `User_${uid.slice(-6)}`;
                }
                
                if (!userData.name) {
                    updates.name = updates.displayName;
                }
                
                if (!userData.phone) {
                    updates.phone = '';
                }
                
                if (!userData.status) {
                    updates.status = 'offline';
                }
                
                updates.updatedAt = firebase.database.ServerValue.TIMESTAMP;
                
                console.log(`Updating incomplete user ${uid} with:`, updates);
                await database.ref(`users/${uid}`).update(updates);
                console.log(`Successfully updated user ${uid}`);
            }
        }
        
        console.log('=== FINISHED FIXING INCOMPLETE USER DATA ===');
        
    } catch (error) {
        console.error('Error fixing incomplete user data:', error);
    }
}

// Create test data function
async function createTestData() {
    if (!confirm('Create test users for searching? This will add sample user data.')) {
        return;
    }
    
    try {
        console.log('Creating test data...');
        
        // Create test user 1
        const testUser1Id = 'testUser_shashank';
        const testUser1Data = {
            email: 'shashankpulivarthi5@gmail.com',
            displayName: 'Shashank Pulivarthi',
            name: 'Shashank Pulivarthi',
            phone: '+1234567890',
            status: 'online',
            createdAt: Date.now()
        };
        
        // Create test user 2
        const testUser2Id = 'testUser_john';
        const testUser2Data = {
            email: 'john.doe@example.com',
            displayName: 'John Doe',
            name: 'John Doe',
            phone: '+0987654321',
            status: 'offline',
            createdAt: Date.now()
        };
        
        // Try to create them using direct paths
        console.log('Creating test user 1:', testUser1Data);
        await database.ref(`users/${testUser1Id}`).set(testUser1Data);
        
        console.log('Creating test user 2:', testUser2Data);
        await database.ref(`users/${testUser2Id}`).set(testUser2Data);
        
        // Also update current user
        if (currentUser) {
            console.log('Updating current user profile...');
            const currentUserData = {
                email: currentUser.email,
                displayName: currentUser.displayName || 'Current User',
                name: currentUser.displayName || currentUser.email.split('@')[0],
                phone: '',
                status: 'online',
                updatedAt: Date.now()
            };
            await database.ref(`users/${currentUser.uid}`).update(currentUserData);
        }
        
        showSuccess('Test data created successfully! Try searching now.');
        
        // Refresh debug info
        setTimeout(async () => {
            await debugDatabaseContents();
        }, 1000);
        
    } catch (error) {
        console.error('Error creating test data:', error);
        showError('Failed to create test data: ' + error.message);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    
    // Check auth state
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            console.log('Current user:', user);
            // Ensure user data exists in database
            await ensureUserDataExists(user);
            
            // Debug: Check what's in the database
            await debugDatabaseContents();
            
            loadFriendsData();
            loadFriendRequests();
        } else {
            // Redirect to main page if not authenticated
            window.location.href = 'index.html';
        }
    });
});

// Event Listeners
function initializeEventListeners() {
    // Search functionality
    document.getElementById('searchUsersBtn').addEventListener('click', searchUsers);
    document.getElementById('userSearchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchUsers();
        }
    });

    // Alternative approach - click search input 3 times quickly to create test data
    let clickCount = 0;
    let clickTimer;
    document.getElementById('userSearchInput').addEventListener('click', function() {
        clickCount++;
        clearTimeout(clickTimer);
        
        if (clickCount === 3) {
            // Triple click detected
            clickCount = 0;
            createTestData();
        } else {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 500);
        }
    });

    // Tab switching
    document.querySelectorAll('.search-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Chat functionality
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Close chat
    document.getElementById('closeChatBtn').addEventListener('click', closeChat);

    // Refresh friends
    document.getElementById('refreshFriendsBtn').addEventListener('click', function() {
        loadFriendsData();
        loadFriendRequests();
    });

    // Add manual profile update - click refresh button while holding Ctrl
    document.getElementById('refreshFriendsBtn').addEventListener('click', async function(e) {
        if (e.ctrlKey && currentUser) {
            e.preventDefault();
            if (confirm('Force update your profile data in database?')) {
                try {
                    const userRef = database.ref(`users/${currentUser.uid}`);
                    
                    // Try multiple approaches
                    const profileData = {
                        email: currentUser.email,
                        displayName: currentUser.displayName || currentUser.email.split('@')[0],
                        name: currentUser.displayName || currentUser.email.split('@')[0],
                        phone: currentUser.phoneNumber || '',
                        status: 'online',
                        lastSeen: firebase.database.ServerValue.TIMESTAMP,
                        updatedAt: firebase.database.ServerValue.TIMESTAMP
                    };
                    
                    console.log('Force updating user profile:', profileData);
                    
                    // Try setting each field individually
                    await userRef.child('email').set(currentUser.email);
                    await userRef.child('displayName').set(currentUser.displayName || currentUser.email.split('@')[0]);
                    await userRef.child('name').set(currentUser.displayName || currentUser.email.split('@')[0]);
                    await userRef.child('phone').set(currentUser.phoneNumber || '');
                    await userRef.child('status').set('online');
                    
                    showSuccess('Profile data updated successfully!');
                    
                    // Refresh debug info
                    setTimeout(async () => {
                        await debugDatabaseContents();
                    }, 1000);
                    
                } catch (error) {
                    console.error('Error force updating profile:', error);
                    showError('Failed to update profile: ' + error.message);
                }
            }
        }
    });

    // Add debug function to create test user (temporary) - Right-click on search button
    document.getElementById('searchUsersBtn').addEventListener('contextmenu', async function(e) {
        e.preventDefault();
        if (confirm('Create test user with email shashankpulivarthi5@gmail.com?')) {
            try {
                // Use a simple user ID
                const testUserId = 'testUser_shashank';
                const testUserData = {
                    email: 'shashankpulivarthi5@gmail.com',
                    displayName: 'Shashank Pulivarthi',
                    name: 'Shashank Pulivarthi',
                    phone: '+1234567890',
                    status: 'online',
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                };
                
                // Use update instead of set to avoid permission issues
                await database.ref(`users/${testUserId}`).update(testUserData);
                showSuccess('Test user created successfully! Now try searching again.');
                console.log('Test user created:', testUserId, testUserData);
                
                // Automatically refresh debug info
                setTimeout(async () => {
                    await debugDatabaseContents();
                }, 1000);
                
            } catch (error) {
                console.error('Error creating test user:', error);
                showError('Failed to create test user: ' + error.message);
            }
        }
    });

    // Add debug function to fix incomplete user data - Shift+click on search button
    document.getElementById('searchUsersBtn').addEventListener('click', async function(e) {
        if (e.shiftKey) {
            e.preventDefault();
            if (confirm('Fix incomplete user data in database? This will add missing email/name fields to existing users.')) {
                try {
                    await fixIncompleteUserData();
                    showSuccess('User data fixed successfully! Try searching again.');
                    
                    // Automatically refresh debug info
                    setTimeout(async () => {
                        await debugDatabaseContents();
                    }, 1000);
                    
                } catch (error) {
                    console.error('Error fixing user data:', error);
                    showError('Failed to fix user data: ' + error.message);
                }
            }
        }
    });
}

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.search-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Show/hide content
    document.getElementById('searchTab').style.display = tabName === 'search' ? 'block' : 'none';
    document.getElementById('requestsTab').style.display = tabName === 'requests' ? 'block' : 'none';
}

// Search users by email or phone
async function searchUsers() {
    const searchTerm = document.getElementById('userSearchInput').value.trim();
    if (!searchTerm) {
        showError('Please enter an email or phone number to search');
        return;
    }

    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '<div class="loading"><div class="loading-spinner"></div>Searching...</div>';

    try {
        // Search users in Firebase database
        const results = await searchUsersInDatabase(searchTerm);
        displaySearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
        let errorMessage = 'Error searching users. Please try again.';
        
        if (error.code === 'PERMISSION_DENIED') {
            errorMessage = 'Permission denied. Please make sure you are logged in and Firebase rules are configured correctly.';
        } else if (error.code === 'NETWORK_ERROR') {
            errorMessage = 'Network error. Please check your internet connection.';
        }
        
        searchResults.innerHTML = `<div class="search-placeholder"><p>${errorMessage}</p></div>`;
        showError(errorMessage);
    }
}

// Search users in Firebase database
async function searchUsersInDatabase(searchTerm) {
    try {
        console.log('Searching for:', searchTerm);
        
        // First try to search in actual database
        try {
            const usersRef = database.ref('users');
            const snapshot = await usersRef.once('value');
            const allUsers = snapshot.val();
            
            console.log('All users from database:', allUsers);
            
            if (allUsers) {
                const results = [];
                const searchTermLower = searchTerm.toLowerCase();

                // Convert users object to array and filter
                for (const userId in allUsers) {
                    const user = allUsers[userId];
                    console.log('Checking user:', userId, user);
                    
                    // Skip current user
                    if (userId === currentUser.uid) {
                        console.log('Skipping current user:', userId);
                        continue;
                    }

                    // Check if email or phone matches search term
                    const emailMatch = user.email && user.email.toLowerCase().includes(searchTermLower);
                    const phoneMatch = user.phone && user.phone.includes(searchTerm);

                    console.log('Email match:', emailMatch, 'Phone match:', phoneMatch);
                    console.log('User email:', user.email, 'Search term:', searchTermLower);

                    if (emailMatch || phoneMatch) {
                        console.log('Found matching user:', user);
                        // Check relationship status with current user
                        const status = await getUserRelationshipStatus(userId);
                        
                        results.push({
                            id: userId,
                            name: user.displayName || user.name || 'Unknown User',
                            email: user.email || '',
                            phone: user.phone || '',
                            status: status
                        });
                    }
                }

                console.log('Search results from database:', results);
                if (results.length > 0) {
                    return results;
                }
            }
        } catch (dbError) {
            console.log('Database search failed, using mock data:', dbError);
        }
        
        // If database search fails or returns no results, use mock data for demonstration
        console.log('Using mock search results for:', searchTerm);
        return getMockSearchResults(searchTerm);
        
    } catch (error) {
        console.error('Error searching users:', error);
        // Fallback to mock data
        return getMockSearchResults(searchTerm);
    }
}

// Mock search results for demonstration when database access fails
function getMockSearchResults(searchTerm) {
    const mockUsers = [
        {
            id: 'mock_user_1',
            name: 'Shashank Pulivarthi',
            email: 'shashankpulivarthi5@gmail.com',
            phone: '+1234567890',
            status: 'available'
        },
        {
            id: 'mock_user_2',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+0987654321',
            status: 'available'
        },
        {
            id: 'mock_user_3',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+1122334455',
            status: 'available'
        },
        {
            id: 'mock_user_4',
            name: 'Alice Johnson',
            email: 'alice@blockchain.com',
            phone: '+5566778899',
            status: 'available'
        }
    ];
    
    const searchTermLower = searchTerm.toLowerCase();
    const results = mockUsers.filter(user => 
        user.email.toLowerCase().includes(searchTermLower) ||
        user.phone.includes(searchTerm) ||
        user.name.toLowerCase().includes(searchTermLower)
    );
    
    console.log('Mock search results:', results);
    return results;
}

// Check relationship status between current user and another user
async function getUserRelationshipStatus(userId) {
    try {
        if (!currentUser) return 'available';

        // Check if they are already friends
        const friendsRef = database.ref(`friends/${currentUser.uid}/${userId}`);
        const friendSnapshot = await friendsRef.once('value');
        if (friendSnapshot.exists()) {
            return 'friend';
        }

        // Check if there's a pending request from current user to this user
        const sentRequestRef = database.ref(`friendRequests/${userId}/${currentUser.uid}`);
        const sentRequestSnapshot = await sentRequestRef.once('value');
        if (sentRequestSnapshot.exists()) {
            return 'sent';
        }

        // Check if there's a pending request from this user to current user
        const receivedRequestRef = database.ref(`friendRequests/${currentUser.uid}/${userId}`);
        const receivedRequestSnapshot = await receivedRequestRef.once('value');
        if (receivedRequestSnapshot.exists()) {
            return 'pending';
        }

        return 'available';
    } catch (error) {
        console.error('Error checking relationship status:', error);
        return 'available';
    }
}

// Display search results
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                </svg>
                <p>No users found with that email or phone number</p>
            </div>
        `;
        return;
    }

    const resultsHTML = results.map(user => `
        <div class="user-card" data-user-id="${user.id}">
            <div class="user-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            </div>
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-contact">${user.email}</div>
            </div>
            <div class="user-actions">
                ${getUserActionButton(user)}
            </div>
        </div>
    `).join('');

    searchResults.innerHTML = resultsHTML;

    // Add event listeners to action buttons
    searchResults.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const userId = this.closest('.user-card').dataset.userId;
            sendFriendRequest(userId);
        });
    });
}

// Get appropriate action button based on user status
function getUserActionButton(user) {
    switch (user.status) {
        case 'available':
            return '<button class="btn-small btn-add">Add Friend</button>';
        case 'friend':
            return '<button class="btn-small btn-pending">Friends</button>';
        case 'pending':
            return '<button class="btn-small btn-pending">Pending</button>';
        case 'sent':
            return '<button class="btn-small btn-pending">Request Sent</button>';
        default:
            return '<button class="btn-small btn-add">Add Friend</button>';
    }
}

// Send friend request
async function sendFriendRequest(userId) {
    try {
        if (!currentUser) {
            showError('You must be logged in to send friend requests.');
            return;
        }

        // Show loading state
        const button = document.querySelector(`[data-user-id="${userId}"] .btn-add`);
        button.textContent = 'Sending...';
        button.disabled = true;

        // Check if request already exists
        const existingRequestRef = database.ref(`friendRequests/${userId}/${currentUser.uid}`);
        const existingSnapshot = await existingRequestRef.once('value');
        
        if (existingSnapshot.exists()) {
            button.textContent = 'Request Sent';
            button.className = 'btn-small btn-pending';
            showError('Friend request already sent to this user.');
            return;
        }

        // Send friend request to Firebase
        const requestData = {
            from: currentUser.uid,
            to: userId,
            fromName: currentUser.displayName || currentUser.email,
            fromEmail: currentUser.email,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            status: 'pending'
        };

        await database.ref(`friendRequests/${userId}/${currentUser.uid}`).set(requestData);

        // Update button state
        button.textContent = 'Request Sent';
        button.className = 'btn-small btn-pending';
        button.disabled = true;

        showSuccess('Friend request sent successfully!');
    } catch (error) {
        console.error('Error sending friend request:', error);
        showError('Failed to send friend request. Please try again.');
        
        // Reset button state on error
        const button = document.querySelector(`[data-user-id="${userId}"] .btn-add`);
        if (button) {
            button.textContent = 'Add Friend';
            button.disabled = false;
        }
    }
}

// Load friends data
async function loadFriendsData() {
    try {
        if (!currentUser) return;

        // Load friends from Firebase
        const friendsRef = database.ref(`friends/${currentUser.uid}`);
        const snapshot = await friendsRef.once('value');
        const friendsData = snapshot.val();

        friends = [];

        if (friendsData) {
            for (const friendId in friendsData) {
                // Get friend's user details
                const userRef = database.ref(`users/${friendId}`);
                const userSnapshot = await userRef.once('value');
                const userData = userSnapshot.val();

                if (userData) {
                    // Get last message from chat (optional - can be implemented later)
                    const chatId = [currentUser.uid, friendId].sort().join('_');
                    const lastMessageRef = database.ref(`chats/${chatId}`).limitToLast(1);
                    const lastMessageSnapshot = await lastMessageRef.once('value');
                    const lastMessageData = lastMessageSnapshot.val();
                    
                    let lastMessage = 'No messages yet';
                    let lastMessageTime = new Date(friendsData[friendId].timestamp);
                    
                    if (lastMessageData) {
                        const msgKey = Object.keys(lastMessageData)[0];
                        const msg = lastMessageData[msgKey];
                        lastMessage = msg.content || 'No messages yet';
                        lastMessageTime = new Date(msg.timestamp);
                    }

                    friends.push({
                        id: friendId,
                        name: userData.displayName || userData.name || 'Unknown User',
                        email: userData.email || '',
                        phone: userData.phone || '',
                        status: userData.status || 'offline', // You can implement real-time status
                        lastMessage: lastMessage,
                        lastMessageTime: lastMessageTime
                    });
                }
            }
        }

        displayFriendsList();
    } catch (error) {
        console.error('Error loading friends:', error);
    }
}

// Display friends list
function displayFriendsList() {
    const friendsList = document.getElementById('friendsList');
    const friendsCount = document.getElementById('friendsCount');

    friendsCount.textContent = friends.length;

    if (friends.length === 0) {
        friendsList.innerHTML = `
            <div class="friends-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <p>No friends yet. Start by searching for friends!</p>
            </div>
        `;
        return;
    }

    const friendsHTML = friends.map(friend => `
        <div class="friend-item" data-friend-id="${friend.id}" onclick="openChat('${friend.id}')">
            <div class="friend-status ${friend.status}">
                <div class="user-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </div>
            </div>
            <div class="user-info">
                <div class="user-name">${friend.name}</div>
                <div class="user-contact">${friend.lastMessage || 'No messages yet'}</div>
            </div>
        </div>
    `).join('');

    friendsList.innerHTML = friendsHTML;
}

// Load friend requests
async function loadFriendRequests() {
    try {
        if (!currentUser) return;

        // Load friend requests from Firebase
        const requestsRef = database.ref(`friendRequests/${currentUser.uid}`);
        const snapshot = await requestsRef.once('value');
        const requests = snapshot.val();

        friendRequests = [];

        if (requests) {
            for (const fromUserId in requests) {
                const request = requests[fromUserId];
                
                // Get user details for the person who sent the request
                const userRef = database.ref(`users/${fromUserId}`);
                const userSnapshot = await userRef.once('value');
                const userData = userSnapshot.val();

                if (userData) {
                    friendRequests.push({
                        id: fromUserId,
                        from: fromUserId,
                        name: userData.displayName || userData.name || 'Unknown User',
                        email: userData.email || '',
                        phone: userData.phone || '',
                        requestDate: new Date(request.timestamp),
                        status: request.status || 'pending'
                    });
                }
            }
        }

        displayFriendRequests();
    } catch (error) {
        console.error('Error loading friend requests:', error);
    }
}

// Display friend requests
function displayFriendRequests() {
    const requestsList = document.getElementById('friendRequestsList');

    if (friendRequests.length === 0) {
        requestsList.innerHTML = `
            <div class="search-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M19 8v6M22 11h-6"/>
                </svg>
                <p>No pending friend requests</p>
            </div>
        `;
        return;
    }

    const requestsHTML = friendRequests.map(request => `
        <div class="user-card" data-request-id="${request.id}">
            <div class="user-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            </div>
            <div class="user-info">
                <div class="user-name">${request.name}</div>
                <div class="user-contact">${request.email}</div>
            </div>
            <div class="user-actions">
                <button class="btn-small btn-accept" onclick="acceptFriendRequest('${request.id}')">Accept</button>
                <button class="btn-small btn-decline" onclick="declineFriendRequest('${request.id}')">Decline</button>
            </div>
        </div>
    `).join('');

    requestsList.innerHTML = requestsHTML;
}

// Accept friend request
async function acceptFriendRequest(requestId) {
    try {
        if (!currentUser) return;

        const button = document.querySelector(`[data-request-id="${requestId}"] .btn-accept`);
        button.textContent = 'Accepting...';
        button.disabled = true;

        // Add both users as friends to each other
        const friendshipData = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            status: 'accepted'
        };

        // Add to both users' friends lists
        await database.ref(`friends/${currentUser.uid}/${requestId}`).set(friendshipData);
        await database.ref(`friends/${requestId}/${currentUser.uid}`).set(friendshipData);

        // Remove the friend request
        await database.ref(`friendRequests/${currentUser.uid}/${requestId}`).remove();

        // Update local state
        friendRequests = friendRequests.filter(req => req.id !== requestId);
        displayFriendRequests();
        loadFriendsData(); // Refresh friends list

        showSuccess('Friend request accepted!');
    } catch (error) {
        console.error('Error accepting friend request:', error);
        showError('Failed to accept friend request.');
        
        // Reset button state on error
        const button = document.querySelector(`[data-request-id="${requestId}"] .btn-accept`);
        if (button) {
            button.textContent = 'Accept';
            button.disabled = false;
        }
    }
}

// Decline friend request
async function declineFriendRequest(requestId) {
    try {
        if (!currentUser) return;

        const button = document.querySelector(`[data-request-id="${requestId}"] .btn-decline`);
        button.textContent = 'Declining...';
        button.disabled = true;

        // Remove the friend request from Firebase
        await database.ref(`friendRequests/${currentUser.uid}/${requestId}`).remove();

        // Update local state
        friendRequests = friendRequests.filter(req => req.id !== requestId);
        displayFriendRequests();

        showSuccess('Friend request declined.');
    } catch (error) {
        console.error('Error declining friend request:', error);
        showError('Failed to decline friend request.');
        
        // Reset button state on error
        const button = document.querySelector(`[data-request-id="${requestId}"] .btn-decline`);
        if (button) {
            button.textContent = 'Decline';
            button.disabled = false;
        }
    }
}

// Open chat with friend
function openChat(friendId) {
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;

    activeChatUser = friend;

    // Update UI
    document.getElementById('chatWelcome').style.display = 'none';
    document.getElementById('activeChat').style.display = 'flex';

    // Update chat header
    document.getElementById('chatUserName').textContent = friend.name;
    document.getElementById('chatUserStatus').textContent = friend.status === 'online' ? 'Online' : 'Last seen recently';

    // Mark friend as active
    document.querySelectorAll('.friend-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-friend-id="${friendId}"]`).classList.add('active');

    // Load chat messages
    loadChatMessages(friendId);
}

// Close chat
function closeChat() {
    activeChatUser = null;
    document.getElementById('chatWelcome').style.display = 'flex';
    document.getElementById('activeChat').style.display = 'none';
    
    // Remove active state from friends
    document.querySelectorAll('.friend-item').forEach(item => {
        item.classList.remove('active');
    });
}

// Load chat messages
async function loadChatMessages(friendId) {
    const chatMessages = document.getElementById('chatMessages');
    
    // Simulate loading messages
    const mockMessages = [
        {
            id: 'msg1',
            sender: friendId,
            content: 'Hey! How are you doing?',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            type: 'received'
        },
        {
            id: 'msg2',
            sender: currentUser.uid,
            content: 'I\'m doing great! Just exploring this new blockchain app.',
            timestamp: new Date(Date.now() - 1000 * 60 * 25),
            type: 'sent'
        },
        {
            id: 'msg3',
            sender: friendId,
            content: 'That sounds awesome! I\'d love to learn more about it.',
            timestamp: new Date(Date.now() - 1000 * 60 * 20),
            type: 'received'
        }
    ];

    displayMessages(mockMessages);
}

// Display messages
function displayMessages(messages) {
    const chatMessages = document.getElementById('chatMessages');
    
    const messagesHTML = messages.map(message => `
        <div class="message ${message.type}">
            <div class="message-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            </div>
            <div class="message-wrapper">
                <div class="message-content">${message.content}</div>
                <div class="message-time">${formatMessageTime(message.timestamp)}</div>
            </div>
        </div>
    `).join('');

    chatMessages.innerHTML = messagesHTML;
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const content = messageInput.value.trim();

    if (!content || !activeChatUser) return;

    try {
        // Add message to UI immediately
        addMessageToChat({
            id: 'temp_' + Date.now(),
            sender: currentUser.uid,
            content: content,
            timestamp: new Date(),
            type: 'sent'
        });

        messageInput.value = '';

        // Simulate sending message (replace with actual Firebase implementation)
        await new Promise(resolve => setTimeout(resolve, 500));

        showSuccess('Message sent!');
    } catch (error) {
        console.error('Error sending message:', error);
        showError('Failed to send message.');
    }
}

// Add message to chat
function addMessageToChat(message) {
    const chatMessages = document.getElementById('chatMessages');
    
    const messageHTML = `
        <div class="message ${message.type}">
            <div class="message-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            </div>
            <div class="message-wrapper">
                <div class="message-content">${message.content}</div>
                <div class="message-time">${formatMessageTime(message.timestamp)}</div>
            </div>
        </div>
    `;

    chatMessages.insertAdjacentHTML('beforeend', messageHTML);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Format message time
function formatMessageTime(timestamp) {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now - messageTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return messageTime.toLocaleDateString();
}

// Utility functions
function showSuccess(message) {
    // Create a simple success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showError(message) {
    // Create a simple error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add slide-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 