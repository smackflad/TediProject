import axios from "axios";
import router from "../router/index"

export type givenType = {
    flag: Boolean,
    token: String,
    firstname: String,
    lastname: String,
    ProfilePic: String,
    _id: String,
    email: String,
    number: string,
    Education: string,
}

export type likeType = {
    _id: String,
    user: String
}

export type commentType = {
    user: String,
    text: String,
    name: String,
    avatar: String,
    date: String,
    _id: String,
}

export type postType = {
    author: String,
    avatar: String,
    comments: Array<commentType>,
    createdAt: String,
    date: String,
    likes: Array<likeType>,
    name: String,
    pictures: Array<String>,
    text: String,
    updatedAt: String,
    videos: Array<String>,
    voice_recordings: Array<String>,
    __v: Number
    _id: String,
}

export type networkUserType = {
    avatar: String,
    id: String,
    name: String,
    professional_position: String,
    Employment_institution: String
}

export type notificationRequestType = {
    avatar: String,
    id: String,
    name: String,
}

export type notificationNotificationsType = {
    post: String,
    type: String,
    user: String,
    _id: String,
}

export type userListType = {
    firstname: String,
    lastname: String,
    _id: String,
    ProfilePic: String,
    number: String,
    email: String,
}

export type chatsMessagesType = {
    sender: String,
    text: String,
    avatar: String,
    date: String,
    _id: String,
}

export type chatsListType = {
    chaters: Array<String>,
    createdAt: String,
    messages: Array<chatsMessagesType>,
    updatedAt: String,
    __v: Number,
    _id: String,
}

export type currType = {
    id: userListType,
    msg_id: String,
    msgs: Array<chatsMessagesType>,
}

export type otherProfileType = {
    Education: {private: boolean, string: string},
    ProfilePic: String,
    Skills: {private: boolean, skills: Array<string>},
    Experience: {private: boolean, Experience: Array<string>},
    friends: boolean,
    name: string,
}

export type adminUserType = {
    _id: String,
    name: String,
    phoneNumber: String,
    email: String,
    avatar: String,
}


export const login = async (email: string, pass: string): Promise<Number> =>{
    try {
        const response = await axios.post("https://localhost:8000/login", {
            email: email,
            password: pass
        })
        if(!response.data.flag){
            return 2;
        }else{
            if(response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
                if(email === 'admin'){
                    router.push('/admin')
                }else{
                    router.push('/user');
                }
                return -1;
            }
        }
    } catch(errors) {
        console.log("**LOGIN ERROR**");
        return -1;
    }
    return -1;
}

export const logout = async () =>{
    localStorage.clear();
    router.push('/');
}

export const loginCheck = async (): Promise<givenType> =>{
    const user = JSON.parse(localStorage.getItem('user') as string);
    if(!user){
        router.push('/');
    }else {
        try {
            const response = await axios.get("https://localhost:8000/check", {
                headers: {
                    'authorization': 'Bearer ' + user.token
                }
            })
            return user;
        } catch(errors) {
            localStorage.clear();
            router.push('/');
            return Promise.reject(errors);
        }
    }
    return user;
}

export const updateUser = (updated: givenType): givenType =>{
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify(updated));
    router.go(0);
    return updated
}