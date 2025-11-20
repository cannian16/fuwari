<script>
  import { onMount } from 'svelte';
  
  // 从 JSON 文件导入歌单
  import playlistData from '../../content/spec/playlist.json';
  
  let isPlaying = false;
  let audioElement;
  let currentSongIndex = 0;
  let songs = [];
  
  // 初始化歌单
  onMount(() => {
    audioElement.addEventListener('play', () => {
      isPlaying = true;
    });
    
    audioElement.addEventListener('pause', () => {
      isPlaying = false;
    });
    songs = playlistData.songs || [];
    if (songs.length > 0) {
      audioElement.src = songs[currentSongIndex].url;
      audioElement.volume = 0.3; // 设置音量为30%
    }
  });
  
  // 播放/暂停切换
  const togglePlay = () => {
    if (!audioElement || songs.length === 0) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    isPlaying = !isPlaying;
  };
  
  // 播放下一首
  const playNext = () => {
    if (songs.length === 0) return;
    
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    audioElement.src = songs[currentSongIndex].url;
    
    if (isPlaying) {
      audioElement.play();
    }
  };
  
  // 播放上一首
  const playPrevious = () => {
    if (songs.length === 0) return;
    
    currentSongIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    audioElement.src = songs[currentSongIndex].url;
    
    if (isPlaying) {
      audioElement.play();
    }
  };
  
  // 自动播放下一首
  const handleEnded = () => {
    playNext();
  };
</script>

<div class="pb-4 card-base">

  <div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-8 mt-4 mb-2
        before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
        before:absolute before:left-[-16px] before:top-[5.5px]">
    音乐
    {#if songs.length > 0}
      <span class="text-sm font-normal text-gray-500 ml-2">
        ({currentSongIndex + 1}/{songs.length})
      </span>
    {/if}
  </div>
  
  <!-- 当前歌曲信息 -->
  {#if songs.length > 0}
    <div class="mb-4 px-4 flex items-center space-x-2 ">
      <img 
        src={songs[currentSongIndex].cover} 
        alt="封面" 
        class="w-8 h-8 object-cover rounded-md"
      />
      <div class="">
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {songs[currentSongIndex].title}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
          {songs[currentSongIndex].artist}
        </div>
      </div>
    </div>
  {/if}
  
  <!-- 播放控制 -->
  <div class="flex items-center justify-center space-x-4 px-4">
    <!-- 上一首 -->
    <button 
      on:click={playPrevious}
      class="dark:text-white"
      title="上一首"
      disabled={songs.length === 0}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
      </svg>
    </button>
    
    <!-- 播放/暂停 -->
    <button 
      on:click={togglePlay}
      class="dark:text-white"
      title={isPlaying ? '暂停' : '播放'}
      disabled={songs.length === 0}
    >
      {#if isPlaying}
        <!-- 暂停图标 -->
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      {:else}
        <!-- 播放图标 -->
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"></path>
        </svg>
      {/if}
    </button>
    
    <!-- 下一首 -->
    <button 
      on:click={playNext}
      class="dark:text-white"
      title="下一首"
      disabled={songs.length === 0}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
      </svg>
    </button>
  </div>
  
  <audio
    bind:this={audioElement}
    on:ended={handleEnded}
    preload="metadata"
  ></audio>
</div>