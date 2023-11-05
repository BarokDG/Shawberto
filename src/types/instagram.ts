export interface InstagramPostInfoResponse {
  status: "success" | "fail";
  data: InstagramPostInfo;
}

interface InstagramPostInfo {
  taken_at: number;
  pk: string;
  id: string;
  device_timestamp: number;
  media_type: number;
  code: string;
  client_cache_key: string;
  filter_type: number;
  is_unified_video: boolean;
  should_request_ads: boolean;
  original_media_has_visual_reply_media: boolean;
  caption_is_edited: boolean;
  like_and_view_counts_disabled: boolean;
  commerciality_status: string;
  is_paid_partnership: boolean;
  is_visual_reply_commenter_notice_enabled: boolean;
  clips_tab_pinned_user_ids: any[];
  has_delayed_metadata: boolean;
  comment_likes_enabled: boolean;
  comment_threading_enabled: boolean;
  max_num_visible_preview_comments: number;
  has_more_comments: boolean;
  preview_comments: any[];
  photo_of_you: boolean;
  usertags: UserTags[];
  is_organic_product_tagging_eligible: boolean;
  can_see_insights_as_brand: boolean;
  user: User;
  can_viewer_reshare: boolean;
  like_count: number;
  has_liked: boolean;
  top_likers: any[];
  facepile_top_likers: any[];
  image_versions2: {
    candidates: Array<{
      width: number;
      height: number;
      url: string;
      scans_profile: string;
    }>;
    additional_candidates: {
      igtv_first_frame: {
        width: number;
        height: number;
        url: string;
        scans_profile: string;
      };
      first_frame: {
        width: number;
        height: number;
        url: string;
        scans_profile: string;
      };
      smart_frame: null;
    };
    smart_thumbnail_enabled: boolean;
  };
  original_width: number;
  original_height: number;
  caption: {
    pk: string;
    user_id: string;
    text: string;
    type: number;
    created_at: number;
    created_at_utc: number;
    content_type: string;
    status: string;
    bit_flags: number;
    did_report_as_spam: boolean;
    share_enabled: boolean;
    user: User;
    is_covered: boolean;
    is_ranked_comment: boolean;
    media_id: string;
    private_reply_status: number;
  };
  comment_inform_treatment: {
    should_have_inform_treatment: boolean;
    text: string;
    url: null;
    action_type: null;
  };

  sharing_friction_info: {
    should_have_sharing_friction: boolean;
    bloks_app_url: null;
    sharing_friction_payload: null;
  };
  is_dash_eligible: number;
  video_dash_manifest: string;
  video_codec: string;
  number_of_qualities: number;
  video_versions: Array<{
    type: number;
    width: number;
    height: number;
    url: string;
    id: string;
  }>;
  has_audio: boolean;
  video_duration: number;
  can_viewer_save: boolean;
  is_in_profile_grid: boolean;
  profile_grid_control_enabled: boolean;
  view_count: number;
  play_count: number;
  organic_tracking_token: string;
  has_shared_to_fb: number;
  product_type: string;
  deleted_reason: number;
  integrity_review_decision: string;
  commerce_integrity_review_decision: null;
  music_metadata: null;
  is_artist_pick: boolean;
  can_view_more_preview_comments: boolean;
  hide_view_all_comment_entrypoint: boolean;
  inline_composer_display_condition: string;
  inline_composer_imp_trigger_time: number;
  comment_count: number;
  media_cropping_info: {
    square_crop: {
      crop_left: number;
      crop_right: number;
      crop_top: number;
      crop_bottom: number;
    };
  };
  clips_metadata: {
    music_info: null;
    original_sound_info: null;
    audio_type: null;
    music_canonical_id: string;
    featured_label: null;
    mashup_info: {
      mashups_allowed: boolean;
      can_toggle_mashups_allowed: boolean;
      has_been_mashed_up: boolean;
      formatted_mashups_count: null;
      original_media: null;
      privacy_filtered_mashups_media_count: null;
      non_privacy_filtered_mashups_media_count: number;
      mashup_type: null;
      is_creator_requesting_mashup: boolean;
      has_nonmimicable_additional_audio: boolean;
    };
    nux_info: null;
    viewer_interaction_settings: null;
    branded_content_tag_info: {
      additional_audio_username: null;
      audio_reattribution_info: { should_allow_restore: boolean };
    };
    shopping_info: null;
    additional_audio_info: { should_allow_restore: boolean };
    is_shared_to_fb: boolean;
    breaking_content_info: null;
    challenge_info: null;
    reels_on_the_rise_info: null;
    breaking_creator_info: null;
    asset_recommendation_info: null;
    contextual_highlight_info: null;
    clips_creation_entry_point: string;
    audio_ranking_info: null;
    template_info: null;
    is_fan_club_promo_video: null;
    disable_use_in_clips_client_cache: boolean;
    content_appreciation_info: { enabled: boolean };
    achievements_info: {
      show_achievements: boolean;
      num_earned_achievements: null;
    };
    show_achievements: boolean;
    show_tips: boolean;
    merchandising_pill_info: null;
    is_public_chat_welcome_video: boolean;
    professional_clips_upsell_type: number;
  };
}

interface User {
  has_anonymous_profile_picture: boolean;
  fan_club_info: {
    fan_club_id: null;
    fan_club_name: null;
    is_fan_club_referral_eligible: null;
    fan_consideration_page_revamp_eligiblity: null;
    is_fan_club_gifting_eligible: null;
  };
  transparency_product_enabled: boolean;
  latest_reel_media: number;
  is_favorite: boolean;
  is_unpublished: boolean;
  pk: string;
  pk_id: string;
  username: string;
  full_name: string;
  is_private: boolean;
  is_verified: boolean;
  friendship_status: {
    following: boolean;
    outgoing_request: boolean;
    is_bestie: boolean;
    is_restricted: boolean;
    is_feed_favorite: boolean;
  };
  profile_pic_id: string;
  profile_pic_url: string;
  account_badges: any[];
}

interface UserTags {
  in: {
    user: {
      pk: string;
      pk_id: string;
      username: string;
      full_name: string;
      is_private: boolean;
      is_verified: boolean;
      friendship_status: {
        following: boolean;
        followed_by: boolean;
        blocking: boolean;
        muting: boolean;
        is_private: boolean;
        incoming_request: boolean;
        outgoing_request: boolean;
        is_bestie: boolean;
        is_restricted: boolean;
        is_feed_favorite: boolean;
      };
      profile_pic_id: string;
      profile_pic_url: string;
    };
    position: number[];
    start_time_in_video_in_sec: null;
    duration_in_video_in_sec: null;
  };
}
