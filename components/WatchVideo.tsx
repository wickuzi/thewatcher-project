"use client"

import React, { useState, useEffect, useRef } from 'react';
import dummywatches from '@/dummywatches.json';

interface Watch {
  id: string;
  name: string;
  videoUrl: string;
  [key: string]: any;
}

// Función para extraer el ID de un video de YouTube
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Extrae el ID de varias formas de URLs de YouTube
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2]) {
    // Limpiar parámetros adicionales
    const id = match[2].split('?')[0].split('&')[0];
    return id.length === 11 ? id : null;
  }
  
  return null;
};

// Función para verificar si una URL es de YouTube
const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('youtube.') || urlObj.hostname.includes('youtu.be');
  } catch (e) {
    return false;
  }
};

const WatchVideo = ({ videoUrl, watchId }: { videoUrl: string; watchId?: string }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [directVideoUrl, setDirectVideoUrl] = useState<string | null>(null);
  const [isYouTube, setIsYouTube] = useState(false);
  const [youTubeId, setYouTubeId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVertical, setIsVertical] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Determinar la URL del video a mostrar
    let targetUrl = videoUrl || '';
    if (watchId) {
      const watch = (dummywatches as Watch[]).find(w => w.id === watchId);
      if (watch && watch.videoUrl) {
        targetUrl = watch.videoUrl;
      }
    }
    
    console.log('Target URL:', targetUrl);
    
    // Verificar si es un video de YouTube
    const youtubeId = extractYouTubeId(targetUrl);
    console.log('YouTube ID:', youtubeId);
    
    if (youtubeId) {
      console.log('Es un video de YouTube');
      setIsYouTube(true);
      setYouTubeId(youtubeId);
      setIsLoading(false);
    } else if (targetUrl) {
      console.log('No es un video de YouTube, usando reproductor nativo');
      setIsYouTube(false);
      // Asegurarse de que la URL sea accesible
      if (targetUrl.startsWith('http')) {
        setDirectVideoUrl(targetUrl);
      } else {
        // Si es una ruta relativa, construir la URL completa
        setDirectVideoUrl(`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}${targetUrl}`);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [videoUrl, watchId]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const videoAspectRatio = video.videoWidth / video.videoHeight;
      const isVideoVertical = videoAspectRatio < 1; // Si el ancho es menor que el alto
      
      setIsVertical(isVideoVertical);
      setIsLoading(false);
      video.muted = true; // Mute by default
      video.volume = 0; // Ensure volume is off
      
      // Asegurarse de que el video ocupe el ancho completo en móviles
      if (window.innerWidth < 768) { // Para móviles
        video.style.width = '100%';
        video.style.height = 'auto';
      } else {
        // Para pantallas más grandes, mantener la relación de aspecto
        video.style.maxWidth = '100%';
        video.style.maxHeight = '80vh';
        video.style.width = 'auto';
        video.style.height = 'auto';
      }
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => {
          console.error('Error playing video:', e);
          setError('No se pudo reproducir el video.');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Error loading video:', directVideoUrl, e);
    setError('No se pudo cargar el video. Intenta actualizando la página o más tarde.');
    setIsLoading(false);
  };

  if (!isMounted) {
    return (
      <div className="w-full flex items-center justify-center bg-gray-900 rounded-xl" style={{ minHeight: '50vh' }}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando video...</p>
        </div>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
        <p>No hay video disponible</p>
      </div>
    );
  }

  // Renderizar reproductor de YouTube
  const isBrowser = typeof window !== 'undefined';
  const origin = isBrowser ? window.location.origin : '';

  // Función para manejar el error del iframe
  const handleIframeError = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    console.error('Error cargando el video de YouTube:', e);
    setError('No se pudo cargar el video. Intenta verlo directamente en YouTube.');
  };

  if (isYouTube && youTubeId) {
    console.log('Renderizando reproductor de YouTube con ID:', youTubeId);
    
    // Solo mostramos el mensaje si hay un error específico
    if (error) {
      return (
        <div className="w-full aspect-video bg-black rounded-xl flex flex-col items-center justify-center p-4 text-center">
          <p className="text-white text-lg mb-4">{error}</p>
          <a 
            href={`https://www.youtube.com/watch?v=${youTubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            Ver en YouTube
          </a>
        </div>
      );
    }
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <div 
          className="relative bg-black rounded-xl overflow-hidden w-full"
          style={{
            maxHeight: '80vh',
            aspectRatio: '16/9',
            margin: '0 auto'
          }}
        >
          <div className="relative w-full h-full" style={{ pointerEvents: 'none' }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youTubeId}?autoplay=0&mute=0&rel=0&modestbranding=1&playsinline=1&origin=${isBrowser ? encodeURIComponent(origin) : ''}`}
              title="Reproductor de video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
              loading="lazy"
              onError={handleIframeError}
              style={{ pointerEvents: 'auto' }}
            ></iframe>
            
            {/* Overlay con enlace a YouTube - Posicionado en la esquina superior derecha */}
            <div className="absolute top-2 right-2 z-10">
              <a 
                href={`https://www.youtube.com/watch?v=${youTubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/70 text-white px-3 py-1 rounded-full flex items-center text-xs hover:bg-black/80 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                Ver en YouTube
              </a>
            </div>
          </div>
          
          {/* Indicador de YouTube - Movido a la izquierda */}
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center z-10">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube
          </div>
        </div>
      </div>
    );
  }

  // Renderizar reproductor de video estándar para ImageKit u otros
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div 
        className="relative bg-black rounded-xl overflow-hidden w-full max-w-full flex items-center justify-center"
        style={{
          maxHeight: '80vh',
          aspectRatio: isVertical ? '9/16' : '16/9',
          width: '100%',
          margin: '0 auto'
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {directVideoUrl && (
          <>
            <video
              ref={videoRef}
              className={`${isPlaying ? 'cursor-pointer' : ''}`}
              style={{
                width: isVertical ? 'auto' : '100%',
                height: isVertical ? '80vh' : 'auto',
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto'
              }}
              src={directVideoUrl}
              onClick={togglePlayPause}
              onPlay={handlePlay}
              onPause={handlePause}
              onLoadedMetadata={handleLoadedMetadata}
              onError={handleError}
              loop
              playsInline
              preload="metadata"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlayPause}
                className={`p-4 rounded-full bg-black/50 backdrop-blur-sm transition-all ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>
            </div>

            {/* Muted indicator */}
            <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center z-20">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
              Sin sonido
            </div>
          </>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg w-full max-w-2xl">
          <p className="text-red-400 mb-2">Error al cargar el video:</p>
          <p className="text-sm text-gray-300 mb-3">{error}</p>
          <a 
            href={directVideoUrl || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Abrir en una nueva pestaña
          </a>
        </div>
      )}
    </div>
  );
};

export default WatchVideo;