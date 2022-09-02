import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../fBase.js";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function Create() {
    const router = useRouter();
    const user = useSelector((state) => state.user.user);
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");

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
        try {
            await addDoc(collection(db, "review"), {
                user: user.email,
                subject,
                content,
                createdAt: Date.now(),
            });
            alert("저장되었습니다.");
            router.push("/review");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Form onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
                Primary
            </Button>
        </Form>
    );
}
