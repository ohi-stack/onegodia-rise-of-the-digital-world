import React from 'react';
import { Image, Video, Download, Sparkles, Film, ExternalLink, Play } from 'lucide-react';
import { NavigationTab } from '../types';

interface MediaViewProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const MediaView: React.FC<MediaViewProps> = ({ setActiveTab }) => {
  const mediaItems = [
    {
      title: 'Stamford Twilight Metropolitan Panorama',
      category: 'Concept Art & Wallpaper',
      image: '/src/assets/images/onegodia_hero_skyline_1790030990014.jpg',
      resolution: '4K Ultra HD',
    },
    {
      title: 'Stamford Hospital — Genesis Spawn Zone',
      category: 'Environment Architecture',
      image: '/src/assets/images/stamford_hospital_facade_1790031002708.jpg',
      resolution: '1080p',
    },
    {
      title: 'Downtown Stamford & Transit Station at Dusk',
      category: 'Urban Topography',
      image: '/src/assets/images/stamford_station_dusk_1790031015582.jpg',
      resolution: '1080p',
    },
    {
      title: 'Harbor Point Coastal Waterfront & Marina',
      category: 'Coastal Biome',
      image: '/src/assets/images/harbor_point_waterfront_1790031027039.jpg',
      resolution: '1080p',
    },
    {
      title: 'Connecticut Cartographic & Route Network',
      category: 'Tactical World Map',
      image: '/src/assets/images/connecticut_waterbury_map_1790031038853.jpg',
      resolution: 'Digital Map',
    },
  ];

  return (
    <div className="space-y-8 py-4 font-sans text-slate-200">
      <section className="p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Film className="w-3.5 h-3.5" />
            MEDIA & PRESS ASSETS
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Onegodia Visual Archive & Renders
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            High-resolution screenshots, concept art, wallpapers, and environmental assets documenting the development of Onegodia: Rise of the Digital World™.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaItems.map((item, index) => (
          <div
            key={index}
            className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-video overflow-hidden bg-slate-950">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white">
                {item.resolution}
              </div>
            </div>
            <div className="p-4 space-y-2">
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
