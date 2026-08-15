(function () {
  'use strict';

  const futureDate = '2026-12-12';

  const templates = {
    wedding: {
      meta: {
        name: 'Wedding',
        collection: 'Vows in Bloom',
        note: 'Romantic, ceremonial and made for the moment two families become one.',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=86',
        focal: 'center 46%'
      },
      defaults: {
        home_name: 'AANYA & ARJUN', welcome_text: 'Together, we begin', invite_eyebrow: 'With the blessings of our families,',
        invite_text: 'request the pleasure of your company as we promise forever.',
        rsvp_option1_title: 'Joyfully accept', rsvp_option1_subtitle: 'We would not miss it.',
        rsvp_option2_title: 'Regretfully decline', rsvp_option2_subtitle: 'Celebrating you from afar.',
        rsvp_option3_title: 'Sending our love', rsvp_option3_subtitle: 'With you in spirit.',
        modal_contact_blessing: 'Your presence will make our day complete',
        bible_verse: 'Where there is love, there is life.', bible_ref: 'Mahatma Gandhi',
        closing_quote: 'One promise. Two hearts. A lifetime to follow.', closing_subtext: 'Thank you for becoming part of our forever.',
        hosts_tagline: 'With love and gratitude', see_you_btn_text: 'Celebrate With Us', presence_note: 'Your presence is our greatest gift',
        color_primary: '#63253B', color_accent: '#D2B06F',
        bg_image_door: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=84',
        bg_image_invite: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=84',
        bg_image_closing: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=84',
        bg_music_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        moment_label: 'The beginning of always', moment_text: 'Come for the vows. Stay for the laughter, the dancing and the memories we will carry home.',
        detail_time_extra: 'Dinner and dancing to follow', closing_heading: 'With all our hearts', gesture: 'petals'
      },
      demo: { hosts: 'The Mehtas & The Raos', event_date: futureDate, event_time: '6:30 PM onwards', venue_name: 'The Courtyard, Hyderabad', venue_address: 'Jubilee Hills, Hyderabad', venue_maps_url: 'https://maps.google.com/?q=Jubilee+Hills+Hyderabad', phone: '919999999999' }
    },
    engagement: {
      meta: {
        name: 'Engagement', collection: 'The First Yes',
        note: 'Modern romance with a little sparkle and a promise of what comes next.',
        image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1400&q=86', focal: 'center 48%'
      },
      defaults: {
        home_name: 'RHEA & KABIR', welcome_text: 'We said yes', invite_eyebrow: 'A new chapter begins,',
        invite_text: 'and we would love for you to celebrate the promise with us.',
        rsvp_option1_title: 'Would not miss it', rsvp_option1_subtitle: 'Ready to raise a toast.',
        rsvp_option2_title: 'Trying to make it', rsvp_option2_subtitle: 'Saving the date.',
        rsvp_option3_title: 'Sending warm wishes', rsvp_option3_subtitle: 'Cheering for you both.',
        modal_contact_blessing: 'Come be part of our first celebration',
        bible_verse: 'The best thing to hold onto in life is each other.', bible_ref: 'Audrey Hepburn',
        closing_quote: 'A little sparkle, a big promise, and all our favourite people.', closing_subtext: 'Thank you for celebrating the first yes.',
        hosts_tagline: 'With joy from both families', see_you_btn_text: 'Raise a Toast', presence_note: 'Only your love and blessings, please',
        color_primary: '#5D345E', color_accent: '#D6A85F',
        bg_image_door: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=900&q=84',
        bg_image_invite: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=84',
        bg_image_closing: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=84',
        bg_music_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        moment_label: 'A promise worth celebrating', moment_text: 'Before the wedding plans and forever stories, there is this beautiful yes—and we want you beside us.',
        detail_time_extra: 'Cocktails and dinner to follow', closing_heading: 'To new beginnings', gesture: 'sparkle'
      },
      demo: { hosts: 'The Kapoor & Iyer Families', event_date: futureDate, event_time: '7:00 PM onwards', venue_name: 'The Glass House', venue_address: 'Banjara Hills, Hyderabad', venue_maps_url: 'https://maps.google.com/?q=Banjara+Hills+Hyderabad', phone: '919999999999' }
    },
    housewarming: {
      meta: {
        name: 'Housewarming', collection: 'A New Door',
        note: 'Quiet warmth, grateful hearts and the first memories of a new home.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=86', focal: 'center 50%'
      },
      defaults: {
        home_name: 'A NEW BEGINNING', welcome_text: 'A new door opens', invite_eyebrow: 'With grateful hearts,',
        invite_text: 'invite you and your family to fill our new home with warmth and blessings.',
        rsvp_option1_title: 'Gladly attending', rsvp_option1_subtitle: 'We will be there.',
        rsvp_option2_title: 'Will try to come', rsvp_option2_subtitle: 'Trying our best.',
        rsvp_option3_title: 'Sending blessings', rsvp_option3_subtitle: 'May your home be joyful.',
        modal_contact_blessing: 'Your blessing will make this house feel like home',
        bible_verse: 'May this home be a place of happiness, health and peace.', bible_ref: 'A house blessing',
        closing_quote: 'A house is built with walls. A home is made with people.', closing_subtext: 'Thank you for becoming part of our first memories here.',
        hosts_tagline: 'With love and gratitude', see_you_btn_text: 'Step Inside', presence_note: 'Presents in blessings only',
        color_primary: '#6B3530', color_accent: '#C7A15A',
        bg_image_door: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900&q=84',
        bg_image_invite: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=84',
        bg_image_closing: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=900&q=84',
        bg_music_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        moment_label: 'The first memory', moment_text: 'The rooms are ready. The lights are warm. All that is missing is the sound of people we love.',
        detail_time_extra: 'Lunch and blessings to follow', closing_heading: 'Come home to us', gesture: 'light'
      },
      demo: { hosts: 'Mira, Dev & Family', event_date: futureDate, event_time: '11:00 AM onwards', venue_name: 'Saanjh', venue_address: 'Kokapet, Hyderabad', venue_maps_url: 'https://maps.google.com/?q=Kokapet+Hyderabad', phone: '919999999999' }
    },
    birthday: {
      meta: {
        name: 'Birthday', collection: 'Another Sun',
        note: 'Bold colour, playful movement and a celebration that feels impossible to ignore.',
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1400&q=86', focal: 'center 50%'
      },
      defaults: {
        home_name: 'ISHA TURNS 30', welcome_text: 'One more trip around the sun', invite_eyebrow: 'Bring your brightest mood,',
        invite_text: 'and join us for an evening of cake, music and very good stories.',
        rsvp_option1_title: 'Count me in', rsvp_option1_subtitle: 'Ready for the party.',
        rsvp_option2_title: 'I might make it', rsvp_option2_subtitle: 'Keeping the evening free.',
        rsvp_option3_title: 'Sending birthday love', rsvp_option3_subtitle: 'Make a wonderful wish.',
        modal_contact_blessing: 'The best gift is celebrating together',
        bible_verse: 'Count your life by smiles, not tears. Count your age by friends, not years.', bible_ref: 'A birthday wish',
        closing_quote: 'More life. More laughter. More stories worth retelling.', closing_subtext: 'Thank you for making every year brighter.',
        hosts_tagline: 'With cake and questionable dance moves', see_you_btn_text: 'Join the Party', presence_note: 'Your presence is the present',
        color_primary: '#4338CA', color_accent: '#F59E0B',
        bg_image_door: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=900&q=84',
        bg_image_invite: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=900&q=84',
        bg_image_closing: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&q=84',
        bg_music_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        moment_label: 'A night made for stories', moment_text: 'Come hungry, come happy, and leave with at least one memory we will laugh about next year.',
        detail_time_extra: 'Cake at 8:30 PM', closing_heading: 'Make a wish', gesture: 'confetti'
      },
      demo: { hosts: 'Isha & Friends', event_date: futureDate, event_time: '7:30 PM onwards', venue_name: 'Olive Bistro', venue_address: 'Durgam Cheruvu, Hyderabad', venue_maps_url: 'https://maps.google.com/?q=Olive+Bistro+Hyderabad', phone: '919999999999' }
    },
    babyshower: {
      meta: {
        name: 'Baby Shower', collection: 'Little Wonder',
        note: 'Soft, hopeful and full of tiny details for the love already growing.',
        image: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=1400&q=86', focal: 'center 48%'
      },
      defaults: {
        home_name: 'A LITTLE WONDER', welcome_text: 'A tiny dream is on the way', invite_eyebrow: 'With hearts already full,',
        invite_text: 'invite you to shower the parents-to-be with love and gentle wishes.',
        rsvp_option1_title: 'Happily attending', rsvp_option1_subtitle: 'Cannot wait to celebrate.',
        rsvp_option2_title: 'Will try to join', rsvp_option2_subtitle: 'Sending a maybe and a hug.',
        rsvp_option3_title: 'Sending baby love', rsvp_option3_subtitle: 'A world of wishes from afar.',
        modal_contact_blessing: 'A grand little adventure is about to begin',
        bible_verse: 'Sometimes the smallest things take up the most room in your heart.', bible_ref: 'A. A. Milne',
        closing_quote: 'Ten little fingers, ten little toes, and more love than we knew we could hold.', closing_subtext: 'Thank you for welcoming this little wonder with us.',
        hosts_tagline: 'With warmth and excitement', see_you_btn_text: 'Shower With Love', presence_note: 'Your blessings are more than enough',
        color_primary: '#9B4F6B', color_accent: '#A7C5B9',
        bg_image_door: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=900&q=84',
        bg_image_invite: 'https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=900&q=84',
        bg_image_closing: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=84',
        bg_music_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        moment_label: 'Loved before hello', moment_text: 'We have not met this little person yet, but somehow our world already feels softer and brighter.',
        detail_time_extra: 'Games and lunch to follow', closing_heading: 'Small wonder, big love', gesture: 'bubbles'
      },
      demo: { hosts: 'Naina & Rohan', event_date: futureDate, event_time: '12:00 PM onwards', venue_name: 'The Garden Room', venue_address: 'Film Nagar, Hyderabad', venue_maps_url: 'https://maps.google.com/?q=Film+Nagar+Hyderabad', phone: '919999999999' }
    },
    naming: {
      meta: {
        name: 'Naming Ceremony', collection: 'Hello, Little One',
        note: 'A serene welcome for the day a little life receives a name and a roomful of blessings.',
        image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=1400&q=86', focal: 'center 44%'
      },
      defaults: {
        home_name: 'MEET OUR LITTLE STAR', welcome_text: 'A beautiful name awaits', invite_eyebrow: 'With joy in every heartbeat,',
        invite_text: 'invite you to bless our little one as we celebrate their name.',
        rsvp_option1_title: 'Joyfully attending', rsvp_option1_subtitle: 'Ready with all our blessings.',
        rsvp_option2_title: 'Will try to join', rsvp_option2_subtitle: 'Holding the day close.',
        rsvp_option3_title: 'Sending gentle wishes', rsvp_option3_subtitle: 'Blessing the little one from afar.',
        modal_contact_blessing: 'Come whisper a blessing for a lifetime',
        bible_verse: 'A name is the first gift we give a child.', bible_ref: 'A family blessing',
        closing_quote: 'One little name, spoken with a lifetime of love.', closing_subtext: 'Thank you for welcoming our child into your hearts.',
        hosts_tagline: 'With love from our growing family', see_you_btn_text: 'Meet the Little One', presence_note: 'Blessings only, with all our hearts',
        color_primary: '#526B63', color_accent: '#D1AF72',
        bg_image_door: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=900&q=84',
        bg_image_invite: 'https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=900&q=84',
        bg_image_closing: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=900&q=84',
        bg_music_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        moment_label: 'A name for a lifetime', moment_text: 'Join us as our littlest love is introduced to the people who will help shape their world.',
        detail_time_extra: 'Blessings and lunch to follow', closing_heading: 'Hello, little one', gesture: 'stars'
      },
      demo: { hosts: 'Anika, Sameer & Family', event_date: futureDate, event_time: '10:30 AM onwards', venue_name: 'Aaranya Banquet', venue_address: 'Gachibowli, Hyderabad', venue_maps_url: 'https://maps.google.com/?q=Gachibowli+Hyderabad', phone: '919999999999' }
    },
    anniversary: {
      meta: {
        name: 'Anniversary', collection: 'Still, Always',
        note: 'Timeless and intimate—a celebration of all the ordinary days that became a life together.',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1400&q=86', focal: 'center 42%'
      },
      defaults: {
        home_name: '25 YEARS OF US', welcome_text: 'Still choosing each other', invite_eyebrow: 'With a lifetime of stories,',
        invite_text: 'invite you to celebrate the years, the laughter and the love that stayed.',
        rsvp_option1_title: 'Celebrating with you', rsvp_option1_subtitle: 'Would not miss this chapter.',
        rsvp_option2_title: 'Will try to join', rsvp_option2_subtitle: 'Hoping to raise a toast.',
        rsvp_option3_title: 'Sending our love', rsvp_option3_subtitle: 'To many more beautiful years.',
        modal_contact_blessing: 'The years are sweeter with people like you in them',
        bible_verse: 'Grow old along with me; the best is yet to be.', bible_ref: 'Robert Browning',
        closing_quote: 'The grand romance was built in a thousand ordinary days.', closing_subtext: 'Thank you for walking beside us through so many of them.',
        hosts_tagline: 'Still, always, with love', see_you_btn_text: 'Toast With Us', presence_note: 'No gifts—only old stories and warm wishes',
        color_primary: '#4C3D48', color_accent: '#C6A15B',
        bg_image_door: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900&q=84',
        bg_image_invite: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=84',
        bg_image_closing: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=84',
        bg_music_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        moment_label: 'A life in the little things', moment_text: 'The morning tea, the inside jokes, the storms weathered and the joy shared—this is what we are celebrating.',
        detail_time_extra: 'Dinner and memories to follow', closing_heading: 'Still, always', gesture: 'gold'
      },
      demo: { hosts: 'Leela & Vikram', event_date: futureDate, event_time: '7:00 PM onwards', venue_name: 'Falaknuma Terrace', venue_address: 'Hyderabad', venue_maps_url: 'https://maps.google.com/?q=Falaknuma+Hyderabad', phone: '919999999999' }
    },
    graduation: {
      meta: {
        name: 'Graduation', collection: 'The Next Chapter',
        note: 'Optimistic, editorial and ready to turn years of hard work into one bright evening.',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=86', focal: 'center 48%'
      },
      defaults: {
        home_name: 'SHE DID IT', welcome_text: 'The next chapter starts here', invite_eyebrow: 'After the late nights and long days,',
        invite_text: 'invite you to celebrate a milestone earned one brave step at a time.',
        rsvp_option1_title: 'I will be there', rsvp_option1_subtitle: 'Ready to cheer loudly.',
        rsvp_option2_title: 'Trying to make it', rsvp_option2_subtitle: 'Saving the celebration.',
        rsvp_option3_title: 'Sending congratulations', rsvp_option3_subtitle: 'So proud from afar.',
        modal_contact_blessing: 'Come celebrate the work, the courage and what comes next',
        bible_verse: 'The future belongs to those who believe in the beauty of their dreams.', bible_ref: 'Eleanor Roosevelt',
        closing_quote: 'This is not the finish line. It is the view from the first summit.', closing_subtext: 'Thank you for believing before the result arrived.',
        hosts_tagline: 'Proud beyond words', see_you_btn_text: 'Come Celebrate', presence_note: 'Bring your loudest cheer',
        color_primary: '#183B56', color_accent: '#D2A94A',
        bg_image_door: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=84',
        bg_image_invite: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=84',
        bg_image_closing: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&q=84',
        bg_music_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        moment_label: 'Hard work, made visible', moment_text: 'This moment holds every early morning, every difficult lesson and every person who said: keep going.',
        detail_time_extra: 'Dinner and a proud toast to follow', closing_heading: 'Onward', gesture: 'ribbons'
      },
      demo: { hosts: 'Tara & The Sharma Family', event_date: futureDate, event_time: '6:00 PM onwards', venue_name: 'The Deccan Club', venue_address: 'Secunderabad, Hyderabad', venue_maps_url: 'https://maps.google.com/?q=Secunderabad+Hyderabad', phone: '919999999999' }
    }
  };

  const presets = {};
  const defaults = {};
  const demos = {};

  Object.entries(templates).forEach(([key, template]) => {
    const base = Object.assign({ event_type: key }, template.defaults);
    defaults[key] = base;
    demos[key] = Object.assign({}, base, template.demo, {
      show_bible_verse: true,
      show_presence_note: true
    });
    presets[key] = {
      door: [{ name: template.meta.collection, url: base.bg_image_door }],
      invite: [{ name: `${template.meta.name} Story`, url: base.bg_image_invite }],
      closing: [{ name: `${template.meta.name} Closing`, url: base.bg_image_closing }],
      music: [{ name: `${template.meta.name} Instrumental`, url: base.bg_music_url }]
    };
  });

  window.INVITE_TEMPLATE_LIBRARY = { templates, presets, defaults, demos };
})();
