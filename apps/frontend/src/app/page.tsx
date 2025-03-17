
import { Activity, Shield, Clock, Bell, CheckCircle, Server, ArrowRight, Sun, Moon } from 'lucide-react';
import Link from 'next/link';

function App() {
  

  return (
    <div className="min-h-screen  text-white py-12 dark:bg-black transition-colors duration-200">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16">
        

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Monitor Your Services with Confidence
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            24/7 uptime monitoring for your websites, APIs, and services. Get instant alerts when things go wrong.
          </p>
          <div className="flex justify-center gap-4">
           <Link href={"/dashboard"}> <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center gap-2">
              Start Monitoring <ArrowRight className="h-5 w-5" />
            </button></Link>
      
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 dark:text-white">Why Choose Depin-pulse?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
              title="99.9% Reliable"
              description="Our monitoring infrastructure is distributed across multiple regions for maximum reliability."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
              title="Real-time Monitoring"
              description="Check your services every 30 seconds with detailed performance metrics."
            />
            <FeatureCard
              icon={<Bell className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
              title="Instant Alerts"
              description="Get notified immediately via SMS, email, Slack, or webhook when issues occur."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="99.99%" label="Average Uptime" />
            <StatCard number="5M+" label="Checks Per Day" />
            <StatCard number="10k+" label="Happy Customers" />
            <StatCard number="150+" label="Countries Covered" />
          </div>
        </div>
      </section>

    

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6" />
              <span className="text-xl font-bold">UptimeGuard</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-400">Terms</a>
              <a href="#" className="hover:text-blue-400">Privacy</a>
              <a href="#" className="hover:text-blue-400">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }:any) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition dark:shadow-gray-900">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function StatCard({ number, label }:any) {
  return (
    <div className="p-6">
      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{number}</div>
      <div className="text-gray-600 dark:text-gray-300">{label}</div>
    </div>
  );
}



export default App;