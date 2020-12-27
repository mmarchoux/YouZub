var playlist = new Vue({
  el: '#playlist',
  data: {
    urls: [
      { address: 'Foo' },
      { address: 'Bar' }
    ]
  },
  methods: {
    addEndList: function (iUrl) {
      this.urls.push({address: iUrl}); 
    },
    addBeginList: function (iUrl) {
      this.urls.unshift({address: iUrl}); 
    },
    remove: function (iUrl) {
      this.urls.splice(this.urls.indexOf(iUrl), 1); 
    }
  }
});

function getInputValue(){
  // Selecting the input element and get its value 
  var urlToAdd = document.getElementById("urlToAdd").value;
  console.log(urlToAdd);
  return urlToAdd;
}

function addToPlaylist(){
  var input = getInputValue();
  // urls.push({ address: input });
  // playlist.data.urls.push({ address: input });
  if (input) {
    playlist.addEndList(input);
  }
  else {
    $('#addEnd').popover('enable');
    $('#addEnd').popover('show');
    // $('#addEnd').popover('destroy', {delay: {hide: 1000}});
    $("#addEnd").on('shown.bs.popover',function() { 
       setTimeout(function() {
        $("#addEnd").popover("hide")}, 500);
    });
    $('#addEnd').popover('disable');
    // $("#addEnd").popover({ trigger:"manual" }).click(function() { 
    //   var pop = $(this); 
    //   pop.popover("show") 
    //   pop.on('shown.bs.popover',function() { 
    //    setTimeout(function() {
    //     pop.popover("hide")}, 1000); 
    //   }) 
    // });
    console.log("empty");
  }
  // console.log(urls);
}

function playNext(){
  var input = getInputValue();
  // urls.unshift({ address: input });
  // console.log(urls);
  if (input) {
    playlist.addBeginList(input);
  }
  else {
    $('#addFirst').popover('enable');
    $('#addFirst').popover('show');
    $("#addFirst").on('shown.bs.popover',function() { 
       setTimeout(function() {
        $("#addFirst").popover("hide")}, 500);
    });
    $('#addFirst').popover('disable');
    // $('#addEnd').popover('show');
    // $("#addFirst").popover({ trigger:"manual" }).click(function() { 
    //   var pop = $(this); 
    //   pop.popover("show") 
    //   pop.on('shown.bs.popover',function() { 
    //    setTimeout(function() {
    //     pop.popover("hide")}, 1000); 
    //   }) 
    // })
    console.log("empty");
  }
}

function remove(urlToRemove){
  // var input = getInputValue();
  // urls.unshift({ address: input });
  // console.log(urls);
  playlist.remove(urlToRemove);
}