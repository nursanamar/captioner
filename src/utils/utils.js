import cherio from "react-native-cheerio";
import RNFetchBlob from "rn-fetch-blob";
// import { NativeModules } from "react-native";
import { create } from "apisauce";


export function cari(kata,callback = () => {},errCallback = () => {},index = 0){
    let paramPart = kata[index].tag.split(" ");
    let param = paramPart.join("+");
    fetch("https://jagokata.com/kutipan/kata-" + param + ".html").then((res) => {
        return res.text();
    }).then((html) => {
        let $ = cherio.load(html);
        let result = [];
        let list = $("#citatenrijen > li").map((_, li) => {
            result.push({
                author: $(".auteurfbnaam", li).text(),
                quote: $('.fbquote', li).text()
            })
        })
        console.log(result.length,"index "+index,"kata "+param);
        if(index < (kata.length) && result.length <= 0){
            let newIndex = index + 1;
            cari(kata,callback,errCallback,newIndex);
        }else{
            callback(result);
        }
    }).catch((err) => {
        console.log(err);
        errCallback()
    })
    // return result;
}

export function upload(image, callback = () => { },errCallback = () => {}) {
    let uriPArts = image.uri.split("/");
    let filename = uriPArts[uriPArts.length - 1];

    RNFetchBlob.fetch("POST","https://api.imagga.com/v1/content",{
        "Authorization": "Basic YWNjXzUxMGNmYmMyYjkyNDY1YzozZmM2ZWY3NGRiNmQyNTBjYjQzZGI5YmI2YWViMGEwYg==",
        'Content-Type': 'multipart/form-data'
    },[
        {
            name:"image",
            filename: filename,
            data: RNFetchBlob.wrap(image.uri)

        }
    ]).then(res => {
        return res.json();
    }).then(json => {
        callback(json)
    }).catch(err => {
        console.log(err)
        errCallback()
    })
    // const req = new XMLHttpRequest();
    // req.open('GET', image.uri, true);
    // req.responseType = 'blob';
    // req.onload = () => {
    //     // let data = new FormData();
    //     // data.append("image", req.response._data,"test");
    //     // console.log(data)
    //     // fetch("https://api.imagga.com/v1/content", {
    //     //     method: 'POST',
    //     //     body: data,
    //     //     headers: {
    //     //         "Authorization": "Basic YWNjXzUxMGNmYmMyYjkyNDY1YzozZmM2ZWY3NGRiNmQyNTBjYjQzZGI5YmI2YWViMGEwYg=="
    //     //     }
    //     // }).then(res => {
    //     //     return res.json()
    //     // }).then(json => {
    //     //     console.log(json)
    //     //     callback(json);
    //     // }).catch((err => {
    //     //     console.log(err)
    //     // }))
    //     let form = new FormData();
    //     // form.append("image","");
    //     form.append("image",{
    //         uri: image.uri,
    //         type:image.mime,
    //         size: image.size,
    //     },'name');
    //     console.log(form);
    //     xhr = new XMLHttpRequest();
    //     xhr.open("POST", "https://api.imagga.com/v1/content");
    //     // xhr.setRequestHeader("cookie", "session=eyJyZXF1ZXN0X2lkIjpudWxsfQ.DpXElQ.IJ8tMjBZe-Nf8EvH7Hdc7EVC_Gs");
    //     xhr.setRequestHeader("authorization", "Basic YWNjXzUxMGNmYmMyYjkyNDY1YzozZmM2ZWY3NGRiNmQyNTBjYjQzZGI5YmI2YWViMGEwYg==");
    //     xhr.onload = () => {
    //         console.log(xhr.response);
    //     }
    //     xhr.send(form);
    // };
    // req.onerror = () => {
    //     console.log(req.response);
    // };
    // req.send();
}

export function getTag(id,callback = () => {},errCallback = () => {}) {
    fetch("https://api.imagga.com/v1/tagging?language=id&content="+id,{
        headers : {
            "Authorization": "Basic YWNjXzUxMGNmYmMyYjkyNDY1YzozZmM2ZWY3NGRiNmQyNTBjYjQzZGI5YmI2YWViMGEwYg=="
        }
    }).then(res => {
        return res.json();
    }).then(json => {
        console.log(json)
        callback(json);
    }).catch(err => {
        console.log(err)
        errCallback();
    })
}