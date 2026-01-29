"use client";
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Globe, BarChart3, LockKeyhole, Layers, ArrowUpRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden font-sans">
      <Navbar />

      <main>
        {/* Professional Hero Section - Dark Theme with Background Image */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden border-b border-neutral-900">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
              alt="Background"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/20 via-black/40 to-black"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-md mb-8 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                <span className="text-xs font-semibold tracking-wide text-neutral-300 uppercase">Enterprise Grade Security</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-white">
                Secure your digital <br className="hidden md:block" />
                infrastructure today.
              </h1>

              <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                The definitive platform for secure asset management, real-time analytics, and global scalability. Built for teams that demand excellence.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/register" className="w-full sm:w-auto px-8 py-4 bg-white text-black text-sm font-semibold rounded-lg hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2">
                  Start Free Trial <ArrowRight size={16} />
                </Link>
                <Link href="/demo" className="w-full sm:w-auto px-8 py-4 border border-neutral-700 bg-transparent hover:bg-neutral-900 text-white text-sm font-semibold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2">
                  View Documentation
                </Link>
              </div>

              <div className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {['Acme Corp', 'GlobalBank', 'Nebula', 'Vertex', 'Orbit'].map((brand) => (
                  <span key={brand} className="text-lg font-bold text-neutral-500 font-sans tracking-tight hover:text-white transition-colors cursor-default">{brand}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features - Clean Minimal Cards Dark */}
        <section className="py-32 bg-black relative z-20">
          <div className="container mx-auto px-6">
            <div className="mb-20 max-w-2xl mx-auto text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Engineered for performance</h2>
              <p className="text-neutral-400 text-lg">Our infrastructure provides the foundation for your most critical applications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Globe, title: "Global Edge Network", desc: "Deploy your assets to over 200 locations worldwide with a single click." },
                { icon: Shield, title: "Zero Trust Security", desc: "Identity-based segmentation and military-grade encryption by default." },
                { icon: Zap, title: "Instant Deployment", desc: "Push to deploy in seconds with our automated CI/CD pipelines." },
                { icon: BarChart3, title: "Real-time Metrics", desc: "Monitor your application health with millisecond-precision analytics." },
                { icon: LockKeyhole, title: "Access Control", desc: "Granular permission settings for teams of any size." },
                { icon: Layers, title: "API First", desc: "Everything is programmable. Integrate seamlessly with your existing stack." }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900/20 hover:bg-neutral-900/40 hover:border-neutral-700 transition-all group backdrop-blur-sm"
                >
                  <div className="mb-6 text-neutral-400 group-hover:text-white transition-colors bg-neutral-900 w-12 h-12 flex items-center justify-center rounded-lg border border-neutral-800 group-hover:border-neutral-700">
                    <feature.icon size={24} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Minimal Dark */}
        <section className="py-32 bg-black border-t border-neutral-900">
          <div className="container mx-auto px-6 text-center max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Ready to get started?</h2>
            <p className="text-neutral-400 mb-10 text-lg">Join thousands of developers building the future of security.</p>
            <Link href="/auth/register" className="inline-flex px-10 py-5 bg-white text-black text-base font-semibold rounded-lg hover:bg-neutral-200 transition-all items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:-translate-y-1">
              Create your account <ArrowUpRight size={20} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
