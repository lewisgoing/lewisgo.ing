// components/about/AboutMusic.tsx
'use cache';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaSoundcloud, FaPlay, FaPause } from 'react-icons/fa';
import { MoveUpRight } from 'lucide-react';
import Image from '../assets/ImageBox';
import Link from '../assets/Link';
import { getAudioUrl } from '../../src/utils/blob-utils';
import SectionHeading from './SectionHeading';

// Music track type definition
interface Track {
  title: string;
  description: string;
  image: string;
  audioSrc: string;
  duration: string;
  releaseDate: string;
  soundcloudUrl: string;
}

// Sample tracks
const tracks: Track[] = [
  {
    title: "Closer",
    description: "Collaboration with Avi8. A progressive dance track with emotional melodies and driving percussion.",
    image: "/albumart/closer.webp",
    audioSrc: "/audio/closer.mp3",
    duration: "3:45",
    releaseDate: "2023",
    soundcloudUrl: "https://soundcloud.com/lewisgoing/closer"
  },
  {
    title: "New Paths",
    description: "Production for Pradaaslife. Atmospheric hip-hop beat with ethereal synths and deep bass.",
    image: "/albumart/newpaths.webp",
    audioSrc: "/audio/newpaths.mp3",
    duration: "2:30",
    releaseDate: "2022",
    soundcloudUrl: "https://soundcloud.com/lewisgoing/newpaths"
  },
  {
    title: "Winter '22 Samples",
    description: "Collection of experimental electronic music exploring textural sound design and rhythmic patterns.",
    image: "/albumart/winter22.webp",
    audioSrc: "/audio/winter22.mp3",
    duration: "4:22",
    releaseDate: "2022",
    soundcloudUrl: "https://soundcloud.com/lewisgoing/winter22"
  }
];

const AboutMusic = () => {
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Handle play/pause
  const togglePlay = (index: number) => {
    if (!audioRef.current) return;
    
    if (playingTrack === index) {
      // Pause current track
      audioRef.current.pause();
      setPlayingTrack(null);
    } else {
      // Play new track
      audioRef.current.src = getAudioUrl(tracks[index].audioSrc);
      audioRef.current.play()
        .then(() => {
          setPlayingTrack(index);
        })
        .catch(error => {
          console.error("Error playing audio:", error);
        });
    }
  };
  
  // Pause audio when unmounting
  React.useEffect(() => {
    return () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  return (
    <section className="mb-16">
      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={() => setPlayingTrack(null)} />
      
      {/* Section heading */}
      <SectionHeading 
        title="Music & Creative Work"
        subtitle="Selected tracks and productions"
      />
      
      {/* Introduction */}
      <motion.div 
        className="bg-secondary rounded-2xl p-6 mb-10 border border-border"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative w-24 h-24 flex-shrink-0">
            <FaSoundcloud className="w-24 h-24 text-primary" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2">My Music Journey</h3>
            <p className="text-muted-foreground">
              Music production has been a passion of mine for years, allowing me to explore creativity through sound design, composition, and collaboration. I create electronic music ranging from ambient soundscapes to driving dance tracks, often incorporating organic elements and experimental techniques.
            </p>
            <Link 
              href="https://soundcloud.com/lewisgoing" 
              className="flex items-center mt-4 text-primary hover:underline"
              target="_blank"
            >
              <span className="mr-1">Listen on SoundCloud</span>
              <MoveUpRight size={16} />
            </Link>
          </div>
        </div>
      </motion.div>
      
      {/* Music tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track, index) => (
          <motion.div 
            key={index}
            className="relative bg-secondary rounded-2xl overflow-hidden border border-border h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            {/* Track artwork */}
            <div className="relative h-48 group cursor-pointer" onClick={() => togglePlay(index)}>
              <Image
                src={track.image}
                alt={track.title}
                fill
                className={`object-cover transition-all duration-300 ${
                  playingTrack === index ? 'grayscale-0' : 'grayscale'
                } group-hover:grayscale-0`}
                skeletonClassName="rounded-t-2xl"
              />
              
              {/* Play/pause overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                  {playingTrack === index ? (
                    <FaPause className="text-primary-foreground" />
                  ) : (
                    <FaPlay className="text-primary-foreground ml-1" />
                  )}
                </div>
              </div>
              
              {/* Track info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-semibold text-sm">{track.title}</h3>
                    <p className="text-white/80 text-xs">{track.releaseDate}</p>
                  </div>
                  <div className="text-white/80 text-xs">{track.duration}</div>
                </div>
              </div>
            </div>
            
            {/* Track details */}
            <div className="p-4">
              <p className="text-muted-foreground text-sm mb-4">{track.description}</p>
              <Link 
                href={track.soundcloudUrl} 
                className="text-primary text-sm hover:underline flex items-center"
                target="_blank"
              >
                <span className="mr-1">Full Track on SoundCloud</span>
                <MoveUpRight size={14} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Creative process */}
      <motion.div 
        className="mt-12 bg-tertiary/50 rounded-2xl p-6 border border-border"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-xl font-bold mb-4">My Creative Process</h3>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            My approach to music production blends technical precision with creative experimentation. I start with a core concept or emotion, then build layers of sound that evolve and interact throughout the piece.
          </p>
          <p className="text-muted-foreground">
            Sound design is central to my work, often creating custom instruments and textures from field recordings, synthesizers, and digital processing. This cross-disciplinary approach between music and technology informs both my creative work and development projects.
          </p>
          <p className="text-muted-foreground">
            Collaboration is also a key part of my creative process, working with vocalists, other producers, and visual artists to create multidimensional experiences that transcend a single medium.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutMusic;