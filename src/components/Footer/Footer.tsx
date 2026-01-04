import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Prime Play</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Your ultimate destination for premium entertainment and streaming content.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" aria-label="Facebook" className="hover:text-white transition">
                                <Facebook size={20} />
                            </Link>
                            <Link href="#" aria-label="Twitter" className="hover:text-white transition">
                                <Twitter size={20} />
                            </Link>
                            <Link href="#" aria-label="Instagram" className="hover:text-white transition">
                                <Instagram size={20} />
                            </Link>
                            <Link href="#" aria-label="LinkedIn" className="hover:text-white transition">
                                <Linkedin size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-sm hover:text-white transition">Home</Link></li>
                            <li><Link href="/dashboard" className="text-sm hover:text-white transition">Dashboard</Link></li>
                            <li><Link href="/dashboard" className="text-sm hover:text-white transition">About</Link></li>
                            <li><Link href="/my-videos" className="text-sm hover:text-white transition">My Videos</Link></li>
                            <li><Link href="/my-playlist" className="text-sm hover:text-white transition">My Playlist</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-sm hover:text-white transition">Help Center</Link></li>
                            <li><Link href="#" className="text-sm hover:text-white transition">Contact Us</Link></li>
                            <li><Link href="#" className="text-sm hover:text-white transition">FAQ</Link></li>
                            <li><Link href="/send-feedback" className="text-sm hover:text-white transition">Feedback</Link></li>
                            <li><Link href="#" className="text-sm hover:text-white transition">Status</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-sm hover:text-white transition">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-sm hover:text-white transition">Terms of Service</Link></li>
                            <li><Link href="#" className="text-sm hover:text-white transition">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Get In Touch</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Mail size={18} className='shrink-0' />
                                <Link href="mailto:basirahmadmalik@gmail.com" className="text-sm hover:text-white transition">basirahmadmalik@gmail.com</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 my-8"></div>

                {/* Bottom Section */}
                <div className="text-center text-sm text-gray-400 space-y-2">
                    <p>&copy; {currentYear} Prime Play. All rights reserved.</p>
                    <p>Made with ❤️ for entertainment lovers worldwide</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;