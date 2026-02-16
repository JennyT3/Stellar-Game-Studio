import { NeonButton } from "@/components/NeonButton";
import { Link } from "wouter";
import { ShieldCheck, Zap, Globe, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Zero Knowledge",
      desc: "Prove your skills without revealing your secrets. Powered by cutting-edge ZK technology."
    },
    {
      icon: Zap,
      title: "Stellar Speed",
      desc: "Built on Stellar for lightning-fast transactions and minimal fees."
    },
    {
      icon: Globe,
      title: "Global Grid",
      desc: "Connect with hackers worldwide in both online and onsite physical challenges."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded border border-primary/30 bg-primary/10 text-primary font-mono text-sm mb-6 tracking-widest">
              SYSTEM INITIALIZED // V.1.0.0
            </span>
            
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-black text-white mb-6 leading-tight">
              ZK <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 text-neon">TRAILS</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body">
              Dive into the neural network. Complete privacy-preserving CTF missions on the Stellar blockchain. 
              Earn reputation without compromising identity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <NeonButton size="lg" className="w-full sm:w-auto">
                  LAUNCH TERMINAL
                </NeonButton>
              </Link>
              <NeonButton variant="outline" size="lg" className="w-full sm:w-auto">
                READ DOCS
              </NeonButton>
            </div>
          </motion.div>

          {/* Hero Image / Graphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 mx-auto max-w-5xl rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden shadow-2xl"
          >
             {/* Unsplash Cyberpunk Cityscape */}
             {/* cyberpunk neon city night futuristic */}
            <div className="aspect-video relative">
              <img 
                src="https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop" 
                alt="Cyberpunk City" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              {/* Overlay UI elements */}
              <div className="absolute bottom-6 left-6 flex items-center gap-4">
                 <div className="flex items-center gap-2 text-primary font-mono text-xs">
                   <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                   LIVE FEED
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative bg-black/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-2xl glass-panel group hover:bg-white/5 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Tech Stack Strip */}
      <div className="border-y border-white/10 bg-black py-8 overflow-hidden">
        <div className="container mx-auto px-4 flex justify-between items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex gap-2 items-center font-display font-bold text-xl"><Cpu/> STELLAR</div>
          <div className="flex gap-2 items-center font-display font-bold text-xl">ZERO KNOWLEDGE</div>
          <div className="flex gap-2 items-center font-display font-bold text-xl">REACT</div>
          <div className="flex gap-2 items-center font-display font-bold text-xl">TYPESCRIPT</div>
        </div>
      </div>
    </div>
  );
}
