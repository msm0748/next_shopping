import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../../fBase";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Link from "next/link";

export default function Article() {
    const user = useSelector((state) => state.user.user);
    const router = useRouter();
    const [confirmUser, setConfirmUser] = useState(false);
    const [subject, setSubject] = useState();
    const [content, setContent] = useState();
    // console.log(router.query.id);
    useEffect(() => {
        getDoc(doc(db, "review", router.query.id)).then((doc) => {
            const data = doc.data();
            if (user) {
                setConfirmUser(data.user === user.email);
            }
            setSubject(data.subject);
            setContent(data.content);
        });
    }, [user]);
    const onDeleteHandler = async () => {
        if (window.confirm("정말 삭제합니까?")) {
            await deleteDoc(doc(db, "review", router.query.id));
            alert("삭제되었습니다.");
            router.push("/review");
        }
    };
    return (
        <div>
            <h1>{subject}</h1>
            <p>{content}</p>
            {confirmUser && (
                <>
                    <Link href={`/articles/${router.query.id}/edit`}>
                        <a>수정</a>
                    </Link>
                    <Button onClick={onDeleteHandler}>삭제</Button>
                </>
            )}
        </div>
    );
}

export async function getServerSideProps(context) {
    return {
        props: {},
    };
}
