import React from 'react';

const MainContent = () => {
  return (
    <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Blockchain Buddy
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your AI-powered companion for seamless BlockDAG network interactions. 
          Make crypto transactions as easy as having a conversation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card hover:shadow-lg transition-shadow duration-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-blockdag-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blockdag-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat Interface</h3>
            <p className="text-gray-600">Natural language commands for blockchain operations</p>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow duration-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-blockdag-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blockdag-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Wallet</h3>
            <p className="text-gray-600">Safe and secure BlockDAG wallet integration</p>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow duration-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-blockdag-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blockdag-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Transactions</h3>
            <p className="text-gray-600">Lightning-fast transactions with BlockDAG technology</p>
          </div>
        </div>
      </div>

      <div className="card max-w-2xl mx-auto">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-6">
            Connect your wallet to begin interacting with the BlockDAG network through our AI-powered interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Connect Wallet
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent; 