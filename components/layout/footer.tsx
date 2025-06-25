import React from "react";

const footerLinks = [
  {
    title: "Categories",
    links: [
      "Graphics & Design",
      "Digital Marketing",
      "Writing & Translation",
      "Video & Animation",
      "Music & Audio",
      "Programming & Tech",
      "AI Services",
      "Consulting",
      "Data",
      "Business",
      "Personal Growth & Hobbies",
      "Photography",
      "Finance",
      "End-to-End Projects",
      "Service Catalog",
    ],
  },
  {
    title: "For Clients",
    links: [
      "How Fiverr Works",
      "Customer Success Stories",
      "Trust & Safety",
      "Quality Guide",
      "Fiverr Learn - Online Courses",
      "Fiverr Guides",
      "Fiverr Answers",
    ],
  },
  {
    title: "For Freelancers",
    links: [
      "Become a Fiverr Freelancer",
      "Become an Agency",
      "Freelancer Equity Program",
      "Community Hub",
      "Forum",
      "Events",
    ],
  },
  {
    title: "Business Solutions",
    links: [
      "Fiverr Pro",
      "Project Management Service",
      "Expert Sourcing Service",
      "ClearVoice - Content Marketing",
      "Working Not Working - Creative Talent",
      "AutoDS - Dropshipping Tool",
      "AI store builder",
      "Fiverr Logo Maker",
      "Contact Sales",
      "Fiverr Go",
    ],
  },
  {
    title: "Company",
    links: [
      "About Fiverr",
      "Help & Support",
      "Social Impact",
      "Careers",
      "Terms of Service",
      "Privacy Policy",
      "Do not sell or share my personal information",
      "Partnerships",
      "Creator Network",
      "Affiliates",
      "Invite a Friend",
      "Press & News",
      "Investor Relations",
    ],
  },
];

const socialIcons = [
  { name: "tiktok", url: "#" },
  { name: "instagram", url: "#" },
  { name: "linkedin", url: "#" },
  { name: "facebook", url: "#" },
  { name: "pinterest", url: "#" },
  { name: "x", url: "#" },
];

const Footer = () => (
  <footer className="bg-white border-t mt-16">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {footerLinks.map((col) => (
          <div key={col.title}>
            <h3 className="font-semibold mb-3 text-lg">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-700 hover:underline text-sm">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between mt-12 border-t pt-6">
        <div className="flex items-center space-x-2">
          <img src="/public/assets/images/bee.png" alt="Logo" className="h-6 w-6" />
          <span className="font-bold text-lg">fiverr.</span>
          <span className="text-gray-500 text-sm">© Fiverr International Ltd. 2025</span>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {socialIcons.map((icon) => (
            <a key={icon.name} href={icon.url} className="text-gray-500 hover:text-black">
              <span className="sr-only">{icon.name}</span>
              {/* Replace with actual icons as needed */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" /></svg>
            </a>
          ))}
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-gray-700 text-sm">English</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-gray-700 text-sm">$ USD</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 