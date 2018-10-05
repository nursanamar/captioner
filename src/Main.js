import React, { Component } from 'react';
import { Spinner,Label,Form,Item,Picker,Title,List,ListItem,Body,Container,Content,Header,Card,Textarea,Button,Grid,Text,Row,Col, CardItem,Icon,Left,Right } from "native-base";
import { CameraRoll,PermissionsAndroid,Image,Clipboard,StyleSheet,TouchableOpacity } from "react-native";
import { cari,upload,getTag } from "./utils/utils";
import ImagePicker from "react-native-image-crop-picker";
import { AdMobBanner,AdMobInterstitial,PublisherBanner } from "react-native-admob";
import { AdUnitID } from "./utils/adUnitId"; //ENABLE ON PRODUCTION MODE
// import { AdUnitID } from "./utils/devUnitId"; //ENABLE ON DEV MODE

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

    componentWillUnmount(){
        ImagePicker.clean()
    }

    rateAlert = () => {
        Alert.alert(
            'Beri kami Rate',
            'Suka dengan aplikasi ini?,ayo beri kami ulasan',
            [
                { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => {
                    Linking.canOpenURL("http://play.google.com/store/apps/details?id=com.captioner").then(supported => {
                        if (!supported) {
                            console.log('Can\'t handle url: ' + url);
                        } else {
                            return Linking.openURL("http://play.google.com/store/apps/details?id=com.captioner");
                        }
                    }).catch(err => console.error('An error occurred', err));
                } },
            ],
            { cancelable: false }
        )
    }

    copyQuote = (index) => {
        let qoutelist = this.state.quotes;
        let selected = qoutelist[index];
        console.log(selected);
        let compose = selected.quote + "\n\n -" + selected.author;
        Clipboard.setString(compose);
        alert("Copied");

        if (Math.floor((Math.random() * 100)) < 20){
            this.rateAlert();
        }

        AdMobInterstitial.setAdUnitID(AdUnitID.adOnCopy);
        AdMobInterstitial.addEventListener('adFailedToLoad',
            (error) => console.warn(error)
        );
        // AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]); //ENABLE ON DEV MODE
        AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
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
        let isAd = 0;
        data.forEach((data,key) => {
            list.push(
                <CardItem bordered button onPress={() => { this.copyQuote(key)}} key={key}>
                    
                        <Body >
                            <Text>{"\"" + data.quote + "\"\n\n"}</Text>
                            <Text style={{ fontStyle: "italic" }} >{"-" + data.author}</Text>
                        </Body>
                   
                </CardItem>
            )
            if(((Math.floor((Math.random() * 10) + 10) % 2) === 0) && (isAd === 0)){
                list.push(
                    <PublisherBanner
                        key={"a"}
                        adSize="fullBanner"
                        adUnitID={AdUnitID.bannerList}
                        // testDevices={[PublisherBanner.simulatorId]} //ENABLE ON DEV MODE
                        onAdFailedToLoad={error => console.error(error)}
                        onAppEvent={event => console.log(event.name, event.info)}
                    />
                )
                isAd++;
            }
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
                                <TouchableOpacity onPress={this.pickImage} style={styles.imageStyle}>

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
                        (this.state.tags.length > 0) && <Form key={0}>
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
                        </Form> 
                    }
                    {
                        (this.state.quotes.length > 0) ? 
                                <Card key={1}>


                                    {list}
                                </Card>
                                :
                                null
                    }
                    <AdMobBanner
                        adSize="fullBanner"
                        adUnitID={AdUnitID.bannerBottom}
                        // testDevices={[AdMobBanner.simulatorId]} //ENABLE ON DEV MODE
                        onAdFailedToLoad={error => console.error(error)}
                    />
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
    },
    imageStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
export default Main;
