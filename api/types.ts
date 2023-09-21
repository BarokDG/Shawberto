export interface VideoInfo {
  code: number;
  msg: string;
  processed_time: string;
  data: {
    aweme_id: string;
    id: string;
    region: string;
    title: string;
    cover: string;
    origin_cover: string;
    duration: number;
    play: string;
    wmplay: string;
    size: number;
    wm_size: number;
    music: string;
    music_info: {
      id: string;
      title: string;
      play: string;
      cover: string;
      author: string;
      original: boolean;
      duration: number;
      album: string;
    };
    play_count: number;
    digg_count: number;
    comment_count: number;
    share_count: number;
    download_count: number;
    create_time: number;
    anchors: any;
    anchors_extras: string;
    is_ad: boolean;
    commerce_info: {
      adv_promotable: boolean;
      auction_ad_invited: false;
      branded_content: number;
      with_comment_filter_words: boolean;
    };
    commercial_video_info: string;
    author: {
      id: string;
      unique_id: string;
      nickname: string;
      avatar: string;
    };
  };
}
