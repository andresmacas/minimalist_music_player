import styles from '../styles/Home.module.css';
import React from 'react';
import Head from 'next/head';
import * as mm from 'music-metadata-browser';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Loader from './loader';
function Home() {
  const [albumArt, setAlbumArt] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [songInfo, setSongInfo] = useState<{ title?: string; artist?: string; duration?: number }>({});
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  })

  useEffect(() => {
    const fetchAlbumArt = async () => {
      try {
        const response = await fetch('/audio/Señor Kino - Elesdí.mp3'); // Reemplaza con la ruta correcta a tu archivo MP3
        const arrayBuffer = await response.arrayBuffer();
        const metadata = await mm.parseBlob(new Blob([arrayBuffer]));
        console.log(metadata);
        if (metadata.common.picture && metadata.common.picture.length > 0) {
          const picture = metadata.common.picture[0];
          const base64Image = `data:${picture.format};base64,${picture.data.toString('base64')}`;
          setAlbumArt(base64Image);
        }
        setSongInfo({
          title: metadata.common.title,
          artist: metadata.common.artist,
          duration: metadata.format.duration,
        });
      } catch (error) {
        console.error('Error al obtener la imagen del álbum:', error);
      }
    };

    fetchAlbumArt();
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>mUser</title>
      </Head>

      <div className='w-full h-full'>
        {<Image className='absolute -z-10'
          src={albumArt}
          layout="fill"
        />}
        <div className={styles.lyrics}>
          No .lrc file found.
        </div>
        <div className={styles.albumCover}>
          <Image
            src={albumArt}
            width={160}
            height={160}
            alt='albumCover'
          />
          <div className='w-full'>
            <h2 className={styles.subInfo}>{songInfo.artist}</h2>
            <p className={styles.info}>{songInfo.title}</p>
            <audio controls className='w-full'>
              <source src="/audio/Señor Kino - Elesdí.mp3" type="audio/mpeg" />
              Tu navegador no soporta la reproducción de audio.
            </audio>
          </div>
        </div>

      </div>


    </React.Fragment>

  );
}

export default Home;

