import React, { Component } from 'react';
import { Spinner,Label,Form,Item,Picker,Title,List,ListItem,Body,Container,Content,Header,Card,Textarea,Button,Grid,Text,Row,Col, CardItem,Icon,Left,Right } from "native-base";
import { CameraRoll,PermissionsAndroid,Image,Clipboard,StyleSheet,TouchableOpacity } from "react-native";
import { cari,upload,getTag } from "./utils/utils";
import ImagePicker from "react-native-image-crop-picker";

class Main  extends Component {

    constructor(props){
        super(props);
        this.state = {
            quotes : [],
            isLoading : false,
            image : null,
            log : "",
            tags : [],
            selectedTag : null

        }
    }

    copyQuote = (index) => {
        let qoutelist = this.state.quotes;
        let selected = qoutelist[index];
        console.log(selected);
        let compose = selected.quote + "\n\n -" + selected.author;
        Clipboard.setString(compose);
        alert("Copied");
    }

    onError = () => {
        this.setState({
            isLoading : false
        })
        alert("Maaf sedang terjadi masalah")
    }

    selectTag = (val) => {
        this.setState({
            isLoading: true,
            log: "Mencari Quote",
            quotes: [],
            selectedTag: val
        })
        let word = this.state.tags[val].tag;
        cari(word, (data) => {
            this.setState({
                quotes: data,
                isLoading: false
            })
        })
    }
    
   buatQuote = async () => {
    if(this.state.image === null){
        return
    }
    this.setState({
        isLoading : true,
        log: "Mengupload gambar"
    })
    upload(this.state.image,(uploaded) => {
        this.setState({
            log: "Menganalisa Gambar"
        })
        getTag(uploaded.uploaded[0].id,(tag) => {
            let word = tag.results[0].tags[0].tag;
            console.log(word,"main");
            this.setState({
                log: "Mencari Quote",
                tags : tag.results[0].tags,
                selectedTag: 0
            })
            cari(word, (data) => {
                this.setState({
                    quotes: data,
                    isLoading: false
                })
                console.log(this.state)
            },this.onError) 
        },this.onError)
    },this.onError)
    
   }

   pickImage = () => {
       ImagePicker.openPicker({
           compressImageQuality : 0.3
       }).then(image => {
           console.log(image);
           this.setState({
               image : {uri : image.path, width : image.width, height : image.height, mime : image.mime}
           })
       });
   }


    render(){
        let data = this.state.quotes;
        let tags = this.state.tags;
        let tagLIst = [];
        let list = [];
        data.forEach((data,key) => {
            list.push(
                <CardItem bordered button onPress={() => { this.copyQuote(key)}} key={key}>
                    
                        <Body >
                            <Text>{"\"" + data.quote + "\"\n\n"}</Text>
                            <Text style={{ fontStyle: "italic" }} >{"-" + data.author}</Text>
                        </Body>
                   
                </CardItem>
            )
        })
        tags.forEach((val,key) => {
            tagLIst.push(
                <Picker.Item label={val.tag} value={key} key={key} />
            )
        })
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>Generate Your Caption</Title>
                    </Body>
                </Header>
                <Content>
                <Card>
                    <CardItem >
                        {
                            this.state.image ?
                                <TouchableOpacity onPress={this.pickImage}>

                                    <Image style={{ width: 300, height: 300, resizeMode: 'contain' }} source={{ uri: this.state.image.uri }} />
                                </TouchableOpacity>
                                :
                                <Body style={styles.wrapUpload}>
                                    <Icon onPress={this.pickImage} name="camera" style={styles.iconUpload} />
                                    <Text>Upload Your Image Here!</Text>
                                </Body>
                        }
                    </CardItem>
                    <CardItem>
                        <Body>
                            {
                                this.state.isLoading ?
                                    [<Spinner key={0} />,
                                    <Text key={1}>{this.state.log}</Text>]
                                    :
                                    <Button onPress={this.buatQuote} full style={{ backgroundColor: '#8642f4' }}>
                                        <Icon name='loop' type="MaterialIcons" />
                                        <Text>Create Caption</Text>
                                    </Button>
                            }
                        </Body>
                    </CardItem>
                </Card>
                    {
                        (this.state.quotes.length > 0) ? 
                            [<Form key={0}>
                                <Item picker>
                                    <Label>Yang kami temukan di foto</Label>
                                    <Picker
                                        mode="dropdown"
                                        selectedValue={this.state.selectedTag}
                                        onValueChange={this.selectTag}
                                    >
                                        {tagLIst}
                                    </Picker>
                                </Item>
                            </Form>,
                                <Card key={1}>


                                    {list}
                                </Card>]
                                :
                                null
                    }
                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    wrapUpload: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        backgroundColor: '#f4f4f4'
    },
    iconUpload: {
        fontSize: 40,
        color: '#8642f4'
    }
});
export default Main;
