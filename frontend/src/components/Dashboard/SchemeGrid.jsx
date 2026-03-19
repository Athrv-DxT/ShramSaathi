import React, { useState } from 'react';
import { SchemeCard } from './SchemeCard';
import { Sprout, Home, ShieldPlus, Briefcase, GraduationCap, Coins, Lightbulb, Droplets, Flame, CreditCard, Stethoscope, Banknote } from 'lucide-react';

const SCHEMES = [
  {
    title: "PM-Kisan Samman Nidhi",
    desc: "Income support of ₹6,000 per year in three equal installments to all landholding farmer families.",
    icon: Sprout,
    colorClass: "bg-green-100 text-green-700"
  },
  {
    title: "Pradhan Mantri Awas Yojana",
    desc: "Housing for All. Providing affordable housing to the urban and rural poor.",
    icon: Home,
    colorClass: "bg-blue-100 text-blue-700"
  },
  {
    title: "Ayushman Bharat (PM-JAY)",
    desc: "World's largest health insurance scheme fully financed by the government providing ₹5 lakh cover.",
    icon: ShieldPlus,
    colorClass: "bg-red-100 text-red-700"
  },
  {
    title: "e-Shram Portal",
    desc: "National Database of Unorganized Workers. Assists in facilitating social security schemes.",
    icon: Briefcase,
    colorClass: "bg-orange-100 text-orange-700"
  },
  {
    title: "PM Svanidhi",
    desc: "Special Micro-Credit Facility for street vendors to resume their livelihoods.",
    icon: Coins,
    colorClass: "bg-purple-100 text-purple-700"
  },
  {
    title: "PM Kaushal Vikas Yojana",
    desc: "Skill certification to enable a large number of Indian youth to take up industry-relevant training.",
    icon: GraduationCap,
    colorClass: "bg-indigo-100 text-indigo-700"
  },
  {
    title: "Stand-Up India Scheme",
    desc: "Facilitates bank loans for setting up a greenfield enterprise by SC/ST or women entrepreneurs.",
    icon: Lightbulb,
    colorClass: "bg-yellow-100 text-yellow-700"
  },
  {
    title: "Jal Jeevan Mission",
    desc: "Provides safe and adequate drinking water through individual household tap connections to rural India.",
    icon: Droplets,
    colorClass: "bg-cyan-100 text-cyan-700"
  },
  {
    title: "Pradhan Mantri Ujjwala Yojana",
    desc: "Provides clean cooking fuel (LPG) to women belonging to BPL households across the country.",
    icon: Flame,
    colorClass: "bg-rose-100 text-rose-700"
  },
  {
    title: "Atal Pension Yojana",
    desc: "A guaranteed pension scheme primarily focused on providing old-age income security to the unorganized sector workers.",
    icon: Banknote,
    colorClass: "bg-emerald-100 text-emerald-700"
  },
  {
    title: "Pradhan Mantri Mudra Yojana",
    desc: "Provides loans up to 10 lakhs to the non-corporate, non-farm small and micro enterprises.",
    icon: CreditCard,
    colorClass: "bg-indigo-100 text-indigo-700"
  },
  {
    title: "PM Suraksha Bima Yojana",
    desc: "A highly subsidized accident insurance scheme offering accidental death and disability cover.",
    icon: Stethoscope,
    colorClass: "bg-pink-100 text-pink-700"
  }
];

export const SchemeGrid = ({ onOpenAssistant }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedSchemes = showAll ? SCHEMES : SCHEMES.slice(0, 6);

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">MyGov Featured Schemes</h2>
            <p className="text-sm text-gray-500">Discover trending government initiatives and check your eligibility instantly using our Voice Assistant.</p>
          </div>
          <button 
             onClick={() => setShowAll(!showAll)}
             className="text-sm font-semibold text-teal-700 bg-teal-50 px-4 py-2 rounded-full hover:bg-teal-100 transition whitespace-nowrap"
          >
              {showAll ? "Show Less Schemes" : "View All Schemes"}
          </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedSchemes.map((s, i) => (
          <SchemeCard 
            key={i} 
            title={s.title} 
            desc={s.desc} 
            icon={s.icon} 
            colorClass={s.colorClass} 
            onAsk={() => onOpenAssistant(`Mujhe ${s.title} ke bare me detail mein samjhao`)} 
          />
        ))}
      </div>
    </div>
  );
};
