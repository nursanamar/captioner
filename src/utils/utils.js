import cherio from "react-native-cheerio";
// import RNFetchBlob from "rn-fetch-blob";
// import { NativeModules } from "react-native";
import { create } from "apisauce";


export function cari(kata,callback = () => {}){
    fetch("https://jagokata.com/kutipan/kata-" + kata + ".html").then((res) => {
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

        callback(result);
    })
    // return result;
}

export async function upload(image,callback = () => {}) {
    fetch(image.uri).then(result => {
       return result.blob();
    }).then(blob => {
        let data = new FormData();
        data.append("image", blob)
        console.log(data)
        fetch("https://api.imagga.com/v1/content", {
            method: 'POST',
            body: data,
            headers: {
                "Authorization": "Basic YWNjXzUxMGNmYmMyYjkyNDY1YzozZmM2ZWY3NGRiNmQyNTBjYjQzZGI5YmI2YWViMGEwYg=="
            }
        }).then(res => {
            return res.json()
        }).then(json => {
            console.log(json)
            callback(json);
        }).catch((err => {
            console.log(err)
        }))
    })
   
   
    // RNFetchBlob.fetch('POST',"https://api.imagga.com/v1/content",{
    //     Authorization: "Basic YWNjXzUxMGNmYmMyYjkyNDY1YzozZmM2ZWY3NGRiNmQyNTBjYjQzZGI5YmI2YWViMGEwYg=="
    // },[
    //     {
    //         name: "image",
    //         data: RNFetchBlob.wrap(image.uri)
    //     }
    // ])

    // var data = new FormData();
    // data.append("image", image);

    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    // xhr.addEventListener("readystatechange", function () {
    //     if (this.readyState === this.DONE) {
    //         console.log(this.responseText);
    //     }
    // });

    // xhr.open("POST", "https://api.imagga.com/v1/content");
    // // xhr.setRequestHeader("cookie", "session=eyJyZXF1ZXN0X2lkIjpudWxsfQ.DpXElQ.IJ8tMjBZe-Nf8EvH7Hdc7EVC_Gs");
    // xhr.setRequestHeader("authorization", "Basic YWNjXzUxMGNmYmMyYjkyNDY1YzozZmM2ZWY3NGRiNmQyNTBjYjQzZGI5YmI2YWViMGEwYg==");

    // xhr.send(data);
}

export function getTag(id,callback = () => {}) {
    fetch("https://api.imagga.com/v1/tagging?language=id&content="+id).then(res => {
        return res.json();
    }).then(json => {
        console.log(json)
        callback(json);
    })
}