import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../../fBase";
import { useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function Edit() {
    const user = useSelector((state) => state.user.user);
    const router = useRouter();
    const [subject, setSubject] = useState();
    const [content, setContent] = useState();

    useEffect(() => {
        getDoc(doc(db, "review", router.query.id)).then((doc) => {
            const data = doc.data();
            setSubject(data.subject);
            setContent(data.content);
        });
    }, [user]);

    const onChangeHandler = (e) => {
        const {
            target: { name, value },
        } = e;

        switch (name) {
            case "subject":
                return setSubject(value);
            case "content":
                return setContent(value);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        updateDoc(doc(db, "review", router.query.id), {
            subject,
            content,
            createdAt: Date.now(),
        })
            .then(() => {
                alert("저장되었습니다.");
                router.push("/review");
            })
            .catch((err) => setErrMessage(err));
    };
    return (
        <>
            <Form onSubmit={onSubmitHandler}>
                <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                >
                    <Form.Label>제목</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="제목"
                        name="subject"
                        value={subject}
                        onChange={onChangeHandler}
                    />
                </Form.Group>
                <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                >
                    <Form.Label>내용</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="content"
                        value={content}
                        onChange={onChangeHandler}
                    />
                </Form.Group>
                <Button variant="outline-primary" type="submit">
                    등록
                </Button>
            </Form>
        </>
    );
}

export async function getServerSideProps(context) {
    return {
        props: {},
    };
}
