import { Button } from "@/components/ui/button";
import { Shield, Star, Rocket, Zap, Users, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 gradient-hero text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Professional Logo */}
          <div className="flex items-center justify-center mb-8">
            <Shield className="h-12 w-12 text-white mr-3" />
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Nation Auth
              </h1>
              <p className="text-blue-100 font-medium">Professional Authentication</p>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Multi-Tenant Authentication
            <br />
            <span className="text-blue-100">Made Simple</span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
            Each Google account creates its own isolated authentication environment with unique API keys, 
            user management, and secure endpoints. Perfect for enterprise applications and SaaS platforms.
          </p>

          {/* Professional Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="professional-card bg-white/10 backdrop-blur-sm p-6 text-center rounded-lg">
              <Users className="h-8 w-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">Unlimited</div>
              <div className="text-sm text-blue-100">Users Per Tenant</div>
            </div>
            <div className="professional-card bg-white/10 backdrop-blur-sm p-6 text-center rounded-lg">
              <Shield className="h-8 w-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm text-blue-100">Isolated Tenants</div>
            </div>
            <div className="professional-card bg-white/10 backdrop-blur-sm p-6 text-center rounded-lg">
              <Star className="h-8 w-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">REST</div>
              <div className="text-sm text-blue-100">API Ready</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/firebase-login">
              <Button className="professional-button text-lg px-8 py-4 bg-white text-primary hover:bg-gray-100">
                <Rocket className="h-5 w-5 mr-3" />
                Get Started
              </Button>
            </Link>
            <Button 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
              onClick={() => scrollToSection('docs')}
            >
              <Zap className="h-5 w-5 mr-3" />
              View Documentation
            </Button>
          </div>

          {/* Professional Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="professional-card bg-white/10 backdrop-blur-sm p-6 text-center rounded-lg hover:transform hover:scale-105 transition-all">
              <CheckCircle className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Professional Interface</h3>
              <p className="text-blue-100">
                Clean, modern design with intuitive user experience
              </p>
            </div>
            <div className="professional-card bg-white/10 backdrop-blur-sm p-6 text-center rounded-lg hover:transform hover:scale-105 transition-all">
              <Users className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Multi-Tenant Architecture</h3>
              <p className="text-blue-100">
                Each Google account gets its own isolated authentication environment
              </p>
            </div>
            <div className="professional-card bg-white/10 backdrop-blur-sm p-6 text-center rounded-lg hover:transform hover:scale-105 transition-all">
              <Shield className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
              <p className="text-blue-100">
                Bank-grade security with unique API keys and session management
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
