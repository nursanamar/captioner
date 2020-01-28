import cherio from "react-native-cheerio";
import RNFetchBlob from "rn-fetch-blob";

export async function cari(kata){
    let paramPart = kata.split(" ");
    let param = paramPart.join("+");
    return fetch("https://jagokata.com/kutipan/kata-" + param + ".html").then((res) => {
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
       
        return result;
    })
}

export async function upload(image) {
    let uriPArts = image.uri.split("/");
    let filename = uriPArts[uriPArts.length - 1];

    return RNFetchBlob.fetch("POST","https://api.imagga.com/v2/uploads",{
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
    })
}

export async function getTag(upload_id) {
    return fetch("https://api.imagga.com/v2/tags?language=id&image_upload_id="+upload_id,{
        headers : {
            "Authorization": "Basic YWNjXzUxMGNmYmMyYjkyNDY1YzozZmM2ZWY3NGRiNmQyNTBjYjQzZGI5YmI2YWViMGEwYg=="
        }
    }).then(res => {
        return res.json();
    });
}