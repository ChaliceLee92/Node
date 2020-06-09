const fs = require('fs');
const qiniu = require('qiniu');
const Progress = require('./progress');
const request = require('request');
const util = require('util');
const xlsx = require('node-xlsx');
const path=require('path');

/**
 * 七牛配置
 */
const accessKey = 'jWBwdtM7gNCDlgVCRvn1MvdOoOiFYs0O-CQgt283';
const secretKey = '3OgyfpnAx5FxZkbI8Y1Hzta2kye1hGzYgg8c4Eho';
const bucket = 'beautiful-reading-audio';

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

// 进度条
const pb = new Progress('上传进度', 50);

fs.readdir('./assets/', function (err, files) {
	let num = 0;
	let total = files.length;
	let videoArr = [];

	pb.render({ completed: num, total: total }); // 更新进度条

    files.forEach(fileName => {
        
        if (path.extname(fileName) === '.mp4') {
            const options = {
                scope: bucket + ':' + fileName, // 覆盖上传 key 是文件名称
                // expires: 14400, // 过期时间
                returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(fname)","uuid":"${uuid}","duration":${avinfo.video.duration},"width":${avinfo.video.width},"height":${avinfo.video.height}}', // 定义返回内容
                callbackBodyType: 'application/json',
            };
    
            const putPolicy = new qiniu.rs.PutPolicy(options); // 鉴权
    
            const uploadToken = putPolicy.uploadToken(mac); // token
    
            const config = new qiniu.conf.Config(); // 构建config 对象
            config.zone = qiniu.zone.Zone_z2; // 空间对应的机房
    
            config.useHttpsDomain = true; // 是否使用https域名
    
            config.useCdnDomain = true; // 上传是否使用cdn加速
    
            // const formUploader = new qiniu.form_up.FormUploader(config); //
            var resumeUploader = new qiniu.resume_up.ResumeUploader(config);
            // const putExtra = new qiniu.form_up.PutExtra();
            const putExtra = new qiniu.resume_up.PutExtra(); 
    
            resumeUploader.putFile(uploadToken, fileName, './assets/' + fileName, putExtra, function (respErr, respBody, respInfo) {
                if (respErr) {
                    throw respErr;
                }
    
                if (respInfo.statusCode === 200) {
                    num++;
                    if (num <= total) {
                        pb.render({ completed: num, total: total }); // 更新进度条
                    }
    
                    fs.appendFile('./success.txt', util.inspect(respBody), function (err) {
                        if (err) throw err;
                        console.log(' 上传成功 ');
                    });
    
                    videoArr.push(respBody);
    
                    const data = [{ name: 'sheet1', data: [['key', 'hash', 'fsize', 'bucket', 'name', 'uuid', 'duration', 'width', 'height']] }];
    
                    for (let { key, hash, fsize, bucket, name, uuid, duration, width, height } of videoArr) {
                        data[0].data.push([key, hash, fsize, bucket, name, uuid, duration, width, height]);
                    }
    
                    let buffer = xlsx.build(data);
    
                    fs.writeFileSync('./video.xlsx', buffer, { flag: 'w' }); // 如果文件存在，覆盖
                } else {
                    fs.appendFile('./error.txt', util.inspect(respBody), function (err) {
                        if (err) throw err;
                        console.log(' 上传失败 ');
                    });
                }
            });
        }
	});
});
