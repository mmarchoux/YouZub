/* definition of constants*/

const restUrl = "http://rushmore.freeboxos.fr/yuzeub";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const token = urlParams.get('token');

const restService = restUrl + "/list?token=" + token;
const restSearchService = restUrl + "/search?token=" + token;
const restSwapService = restUrl + "/swap?token=" + token;

const POPUP_TIMEOUT = 2000;

const REFRESH_INTERVAL = 10000;
window.setInterval('refresh()', REFRESH_INTERVAL);


/* Playlist */
var playlist = new Vue({
  el: '#playlist',
  data: {
    musics: [
    ]
  },
  mounted() {
    refresh()
  },
  methods: {
    addEndList: function (input) {
      if (document.getElementById("toggle-state").checked) {
        axios.post(restSearchService+"&query="+input)
            .then(response => {
                this.musics = response.data
            })
      } else {
        axios.post(restService+"&id="+input)
            .then(response => {
                this.musics = response.data
            })
      }
      // Refresh needed because query takes time
      refresh();
    },
    addBeginList: function (input) {
      if (document.getElementById("toggle-state").checked) {
        axios.post(restSearchService+"&query="+input+"&next")
            .then(response => {
                this.musics = response.data
            })
      } else {
        axios.post(restService+"&id="+input+"&next")
            .then(response => {
                this.musics = response.data
            })
      }
      // Refresh needed because query takes time
      refresh();
    },
    remove: function (id) {
      axios.delete(restService+"&id="+id)
          .then(response => {
              this.musics = response.data
          })
    }
  }
});

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Enter key adds video to queue
document.getElementById("inputValue").addEventListener("keyup", event => {
  if(event.key !== "Enter") return;
  document.getElementById("addEnd").click();
  event.preventDefault();
});

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  if (playlist.musics[0] && playlist.musics[0].thumbnail != "loading.gif") {
    player = new YT.Player('player', {
      height: '480',
      width: '720',
      videoId: playlist.musics[0].id,
      playerVars: { autoplay: true },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1)
var started = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !started) {
    started = true;
  }
  if (event.data == YT.PlayerState.ENDED && started) {
    playNextVideo();
  }
}

function refresh() {
  axios.get(restService)
  .then(response => {
      playlist.musics = response.data
      console.log(playlist.musics)

      if (!player) {
        onYouTubeIframeAPIReady();
      }
      else if (player.getVideoData().video_id != playlist.musics[0].id
            && playlist.musics[0].thumbnail != "loading.gif") {
        player.loadVideoById(playlist.musics[0].id);
        player.nextVideo();
      }
  })
}

function playNextVideo() {
  refresh();
  if (playlist.musics.length > 1) {
    player.loadVideoById(playlist.musics[1].id);
    player.nextVideo();
    playlist.remove(playlist.musics[0].id);
  }
}

function setInputText() {
  var input = document.getElementById("inputValue");
  if (document.getElementById("toggle-state").checked) { // Checked -> Search, Untoggled -> URL
    input.placeholder = "Search a music...";
    input.setAttribute("aria-label", "Search a music");
    input.setAttribute("aria-describedby", "search");
  }
  else {
    input.placeholder = "Paste a sharing URL...";
    input.setAttribute("aria-label", "Paste a sharing URL");
    input.setAttribute("aria-describedby", "url");
  }
}

function getInputValue() {
  // Select the input element and get its value
  var input = document.getElementById("inputValue").value;
  document.getElementById("inputValue").value = "";
  console.log(input);

  input = input.replace(" ", "%20");

  // Sharing link
  var reg_share = /^https:\/\/youtu\.be\/(.+)/;
  input = input.replace(reg_share, '$1');
  console.log(input);

  // Normal link
  var reg_url = /^https:\/\/www\.youtube\.com\/watch\?v=(.+)/;
  input = input.replace(reg_url, '$1');
  console.log(input);

  // Playlist link
  var reg_playlist = /^https:\/\/www\.youtube\.com\/playlist\?list=(.+)/;
  input = input.replace(reg_playlist, '$1');
  console.log(input);

  return input;
}

function addQueue() {
  var input = getInputValue();
  if (input) {
    playlist.addEndList(input);
  }
  else {
    popup('#inputValue', 'Missing Input');
  }
}

function addNext(){
  var input = getInputValue();
  if (input) {
    playlist.addBeginList(input);
  }
  else {
    popup('#inputValue', 'Missing Input');
  }
}

function popup(htmlId, message) {
  var el = $(htmlId);
  el.attr('data-content', message)
  el.popover('show');
  el.on('shown.bs.popover',function() {
      setTimeout(function() {
      el.popover("hide")}, POPUP_TIMEOUT);
  });
  console.log(message);
}

function remove(musicToRemove){
  console.log("Removing " + musicToRemove);
  if (musicToRemove == playlist.musics[0].id) {
    playNextVideo();
  } else {
    playlist.remove(musicToRemove);
  }
}

function revealMoveBtns(index) {
  index = parseInt(index)
  music_item = document.getElementById("playlist")
                       .getElementsByClassName("music-item")[index]
  if (index > 1) {
    music_item.getElementsByClassName("up")[0]
              .style.visibility = "visible";
  }
  if (index > 0 && index < playlist.musics.length - 1) {
    music_item.getElementsByClassName("down")[0]
              .style.visibility = "visible";
  }
}

function hideMoveBtns(index) {
  index = parseInt(index)
  music_item = document.getElementById("playlist")
                       .getElementsByClassName("music-item")[index]

  music_item.getElementsByClassName("up")[0]
            .style.visibility = "hidden";
  music_item.getElementsByClassName("down")[0]
            .style.visibility = "hidden";
}

function moveUp(index) {
  index = parseInt(index)
  if (index > 0) {
    swap(playlist.musics[index].id, playlist.musics[index - 1].id)
  }
}

function moveDown(index) {
  index = parseInt(index)
  if (index < playlist.musics.length - 1) {
    swap(playlist.musics[index].id, playlist.musics[index + 1].id)
  }
}

function swap(id_l, id_r) {
  axios.post(restSwapService+"&idl="+id_l+"&idr="+id_r)
       .then(response => {
          playlist.musics = response.data
          console.log(playlist.musics)
       }
    )
}
