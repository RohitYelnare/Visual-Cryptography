$(document).ready(function() {

  function packUi() {
    var padding = 20;
    var cnvWidth = Math.floor($(window).width() - (padding * 2));
    var cnvHeight = (Math.floor($(window).height() / 2) - (padding * 5));

    $('canvas').attr('width', cnvWidth);
    $('canvas').attr('height', cnvHeight);
    $('.page').width(cnvWidth + 2);
    $('.bounds').height((cnvHeight * 2) + 40).width(cnvWidth);
    $('.bounds').attr('expanded-height', $('.bounds').height());
  }


  function flipCoin() {
    return (Math.floor(Math.random() * 2) === 0);
  }

  function paintsubPixel(imageData, i) {
    imageData.data[i] = 0;
    imageData.data[i + 1] = 0;
    imageData.data[i + 2] = 0;
    imageData.data[i + 3] = 255;
  }

  var src = $('#src').get(0);
  var ctx = src.getContext ? src.getContext('2d') : null;

  var share1 =  $('#share1').get(0);
  var share2 =  $('#share2').get(0);
  var share1img   = share1.getContext('2d');
  var share2img   = share2.getContext('2d');

  packUi();
  
  $(document).on('click', '.reset', function() {
    $('#src').show();
    $('.bounds').hide().height($('.bounds').attr('expanded-height'));
    $('.superimpose').hide();
    $('.genshares').show();

    ctx.clearRect(0, 0, src.width, src.height);
    share1img.clearRect(0, 0, src.width, src.height);
    share2img.clearRect(0, 0, src.width, src.height);
  });

  $(document).on('click', '.genshares', function() {
    $('#src').hide();
    $('.bounds').show();

    share1img.clearRect(0, 0, share1img.width, share1img.height);
    share2img.clearRect(0, 0, share2img.width, share2img.height);

    var srcData = ctx.getImageData(0, 0, src.width, src.height);
    var share1Data = share1img.getImageData(0, 0, share1.width, share1.height);
    var share2Data = share2img.getImageData(0, 0, share2.width, share2.height);

    for(var x = 0; x < srcData.width; x += 2) {
      for(var y = 0; y < srcData.height; y++) {
        var i = ((y * srcData.width * 4) + (x * 4));
        var isBlack = (srcData.data[i] == 0 && srcData.data[i+1] == 0
          && srcData.data[i+2] == 0 && srcData.data[i+3] == 255);
        if(isBlack) {
          if(flipCoin()) {
            paintsubPixel(share1Data, i);
            paintsubPixel(share2Data, i + 4);
          } else {
            paintsubPixel(share1Data, i + 4);
            paintsubPixel(share2Data, i);
          }
        } else {
          if(flipCoin()) {
            paintsubPixel(share1Data, i);
            paintsubPixel(share2Data, i);
          } else {
            paintsubPixel(share1Data, i + 4);
            paintsubPixel(share2Data, i + 4);
          }
        }
      }
    }

    share1img.putImageData(share1Data, 0, 0);
    share2img.putImageData(share2Data, 0, 0);

    $('.genshares').hide();
    $('.superimpose').show();

  });

  $(document).on('click', '.superimpose', function() {
    $('.bounds').animate({height: $('#share1').height() + 4}, {duration: 2000});
    $('.superimpose').hide();
  });

});
