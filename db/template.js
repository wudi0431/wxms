var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TemplateSchema = new Schema({
  name: String,
  backgroundcolor: String,//页面背景
  backgroundimage: String,
  category: Number,//1:全部，2：版式，3：风格，4：互动
  imgUrl: String,
  user: {
    id: String,
    name: String
  }
});


TemplateSchema.static('addTplByUser', function (pageId, user, imgUrl, category, cb) {
  return Page.getPage(pageId, function (err, pageEntity) {
    if (pageEntity) {
      var tplEntity = mixObject(pageEntity);

      tplEntity.user = user;
      tplEntity.imgUrl = imgUrl;
      tplEntity.category = category;

      var tpl = new TemplateModel(tplEntity);
      tpl.save(function (err, templateEntity) {
        cb(err, templateEntity);
        if (templateEntity) {
          Btncom.getBtncomListByPageId(pageId, function (err, btncomList) {
            if (btncomList) {
              btncomList.forEach(function (btncomEntity) {
                var newBtncomEntity = mixObject(btncomEntity);
                newBtncomEntity.template = templateEntity._id;
                var newBtncom = new Btncom(newBtncomEntity);
                newBtncom.save();
              });
            }
          });

          Textcom.getTextcomListByPageId(pageId, function (err, textcomList) {
            if (textcomList) {
              textcomList.forEach(function (textcomEntity) {
                var newTextcomEntity = mixObject(textcomEntity);
                newTextcomEntity.template = templateEntity._id;
                var newTextcom = new Textcom(newTextcomEntity);
                newTextcom.save();
              });
            }
          });


          Imgcom.getImgcomListByPageId(pageId, function (err, imgcomList) {
            if (imgcomList) {
              imgcomList.forEach(function (imgcomEntity) {
                var newImgcomEntity = mixObject(imgcomEntity);
                newImgcomEntity.template = templateEntity._id;
                var newImgcom = new Imgcom(newImgcomEntity);
                newImgcom.save();
              });
            }
          });

        }
      });

    }
  });
});

function mixObject(obj) {
  var tmpObj = {};
  for (var key in obj) {
    if (type(obj[key]) == 'string' || type(obj[key]) == 'number' || type(obj[key]) == 'array') {
      tmpObj[key] = obj[key];
    }
  }
  delete tmpObj.id;
  delete tmpObj.__v;
  return tmpObj;
}


TemplateSchema.static('getPubTpl', function (category, cb) {
  return this.find({category: category}).exec(function (err, templateList) {

    if (templateList) {
      templateList = templateList.filter(function (o) {
        return o.user.name === 'admin';
      });
      if (templateList.length > 0) {
        getCom(templateList, cb);
      } else {
        cb(err, templateList);
      }

    }

  });
});

TemplateSchema.static('getTplByUser', function (user, cb) {
  return this.find({
    user: user
  }).exec(function (err, templateList) {
    if (templateList) {
      getCom(templateList, cb);
    }
  });
});

TemplateSchema.static('getOneTpl', function (tplId, cb) {
  return this.findById(tplId).exec(function (err, templateEntity) {
    if (templateEntity) {
      getOneCom(templateEntity, cb);
    }else{
      cb(err, templateEntity);
    }
  });
});


function getOneCom(templateEntity, cb) {
  var oneTpl = templateEntity;
  //Btncom
  Btncom.getBtncomListByTemplateId(templateEntity._id, function (err, btncomList) {

    if (btncomList) {
      oneTpl.btncomtList = btncomList;
    }

    //Imgcom
    Imgcom.getImgcomListByTemplateId(templateEntity._id, function (err, imgcomList) {
      if (imgcomList) {
        oneTpl.imgcomList = imgcomList;
      }
      //Textcom
      Textcom.getTextcomListByTemplateId(templateEntity._id, function (err, textcomList) {

        if (textcomList) {
          oneTpl.textcomList = textcomList;
        }

        var newTpl = mixObject(oneTpl);
        newTpl.uid = oneTpl.id;
        cb(err, newTpl);
      });
      //Textcom End
    });
    //Imgcom End

  });
  //Btncom End
}

function getCom(data, cb) {
  var allTpl = [];
  data.forEach(function (o) {
    var oneTpl = o;
    //Btncom
    Btncom.getBtncomListByTemplateId(o._id, function (err, btncomList) {

      if (err) {

        return;
      }
      if (btncomList) {
        oneTpl.btncomtList = btncomList;
      }

      //Imgcom
      Imgcom.getImgcomListByTemplateId(o._id, function (err, imgcomList) {
        if (err) {

          return;
        }
        if (imgcomList) {
          oneTpl.imgcomList = imgcomList;
        }
        //Textcom
        Textcom.getTextcomListByTemplateId(o._id, function (err, textcomList) {
          if (err) {

            return;
          }
          if (textcomList) {
            oneTpl.textcomList = textcomList;
          }

          var newTpl = mixObject(oneTpl);
          newTpl.uid = oneTpl.id;
          allTpl.push(newTpl);
          if (allTpl.length === data.length) {
            cb(err, allTpl);
          }

        });
        //Textcom End
      });
      //Imgcom End

    });
    //Btncom End

  });
}


function type(o) {
  var TYPES = {
    'undefined': 'undefined',
    'number': 'number',
    'boolean': 'boolean',
    'string': 'string',
    '[object String]': 'string',
    '[object Number]': 'number',
    '[object Function]': 'function',
    '[object RegExp]': 'regexp',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object Error]': 'error'
  };

  var TOSTRING = Object.prototype.toString;
  return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
}


TemplateSchema.static('generationPage', function (projectId, allData, cb) {
  allData.project = projectId;
  var newPage = new Page(allData);
  return newPage.save(function (err, pageEntity) {
    Page.updateProjectTime(pageEntity._id);
    if (allData.btncomtList) {
      allData.btncomtList.forEach(function (o) {
        o._id && delete o._id;
        o.__v && delete o.__v;
        o.template && delete o.template;
        o.page && delete o.page;
        o.page = pageEntity;
        new Btncom(o).save();
      });
    }

    if (allData.imgcomList) {
      allData.imgcomList.forEach(function (o) {
        o._id && delete o._id;
        o.__v && delete o.__v;
        o.template && delete o.template;
        o.page && delete o.page;
        o.page = pageEntity;
        new Imgcom(o).save();
      });
    }

    if (allData.textcomList) {
      allData.textcomList.forEach(function (o) {
        o._id && delete o._id;
        o.__v && delete o.__v;
        o.template && delete o.template;
        o.page && delete o.page;
        o.page = pageEntity;
        new Textcom(o).save();
      });
    }
    cb(err, pageEntity);
  });
});


TemplateSchema.static('deleteTemplate', function (templateId, cb) {
  return this.findByIdAndRemove(templateId).exec(function (err, template) {
    if (template) {
      Btncom.deleteBtncomByTemplate(template._id);
      Textcom.deleteTextcomByTemplate(template._id);
      Imgcom.deleteImgcomByTemplate(template._id);
      if (cb) {
        cb(err, template);
      }
    }
  });
});


var TemplateModel = mongoose.model('Template', TemplateSchema);
module.exports = TemplateModel;

var Page = require('./page');
var Btncom = require('./btncom');
var Textcom = require('./textcom');
var Imgcom = require('./imgcom');
