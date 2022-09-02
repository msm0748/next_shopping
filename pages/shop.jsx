import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../fBase";
import { useSelector } from "react-redux";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";

export default function Shop() {
    const user = useSelector((state) => state.user.user);
    const [attachment, setAttachment] = useState("");
    const onClearAttachment = () => setAttachment("");
    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };
    const onSubmit = async (event) => {
        event.preventDefault();

        let attachmentUrl = "";
        if (attachment !== "") {
            //파일 경로 참조 만들기
            const attachmentRef = ref(storage, `shop/바지/${uuidv4()}`);
            //storage 참조 경로로 파일 업로드 하기
            const response = await uploadString(
                attachmentRef,
                attachment,
                "data_url"
            );
            console.log(response);
            //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
            attachmentUrl = await getDownloadURL(response.ref);
        }

        //트윗 오브젝트
        const nweetObj = {
            text: "이미지",
            createdAt: Date.now(),
            creatorId: user.uid,
            attachmentUrl,
        };

        //트윗하기 누르면 nweetObj 형태로 새로운 document 생성하여 nweets 콜렉션에 넣기
        await addDoc(collection(db, "nweets"), nweetObj);

        //state 비워서 form 비우기
        // setNweet("");

        //파일 미리보기 img src 비워주기
        setAttachment("");
    };
    return (
        <>
            <form onSubmit={onSubmit}>
                제목
                <input type="text" />
                내용
                <input type="text" />
                <input type="file" accept="image/*" onChange={onFileChange} />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
                <button type="submit">전송</button>
            </form>
        </>
    );
}
