'use strict';

var utils = require('../utils/writer.js');
var Images = require('../service/ImageService.js');

module.exports.addImage = function addImage (req, res, next) {
  Images.addImage(req.params.filmId, req.file, req.user.id)
    .then(function (response) {
        utils.writeJson(res, response, 201);
    })
    .catch(function (response) {
      if(response == 403){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner of the film' }], }, 403);
      }
      else if (response == 404){
          utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The resource does not exist.' }], }, 404);
      }
      else if(response == 415){
        utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': 'Unsupported Media Type'}],}, 415);
      } 
      else {
        utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
      }
    });
};

module.exports.getImages = function getImages (req, res, next) {
  Images.getImages(req.params.filmId, req.user.id)
    .then(function (response) {
       utils.writeJson(res, response);
    })
    .catch(function (response) {
      if(response == 403){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner or reviewer of the film' }], }, 403);
      }
      else if (response == 404){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The resource does not exist.' }], }, 404);
      }
      else {
        utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
      }
    });

  
};

module.exports.getSingleImage = function getSingleImage (req, res, next) {

  var mediaType = req.get('Accept');
  if(mediaType != 'application/json' && mediaType != 'image/png' && mediaType != 'image/jpg' && mediaType != 'image/gif'){
    utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': 'Media Type not supported'}],}, 415);
    return;
  }
  var imageType = mediaType.substring(mediaType.lastIndexOf("/") );
  var imageType = imageType.replace('/', '');

  Images.getSingleImage(req.params.imageId, imageType, req.params.filmId, req.user.id)
    .then(function (response) {
       if(imageType == 'json'){
         utils.writeJson(res, response);
       }
       else{
         res.sendFile(response, {root: './uploads'});
       }
    })
    .catch(function (response) {
      if(response == 403){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner or reviewer of the film' }], }, 403);
      }
      else if (response == 404){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The resource does not exist.' }], }, 404);
      }
      else {
        utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
      }
    });
};



module.exports.deleteSingleImage = function deleteSingleImage (req, res, next) {
  Images.deleteSingleImage(req.params.filmId, req.params.imageId, req.user.id)
    .then(function (response) {
       utils.writeJson(res, null, 204);
    })
    .catch(function (response) {
      if(response == 403){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The user is not the owner of the film' }], }, 403);
      }
      else if (response == 404){
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'The resource does not exist.' }], }, 404);
      }
      else {
        utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
      }
    });
};



