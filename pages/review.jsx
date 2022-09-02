import Table from "react-bootstrap/Table";
import Link from "next/link";
import { db } from "../fBase";
import { collection, orderBy, query, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function Review() {
    const router = useRouter();
    const [list, setList] = useState([]);
    const user = useSelector((state) => state.user.user);
    // const [isLoggedIn, setIsLoggedIn]
    useEffect(() => {
        onSnapshot(
            query(collection(db, "review"), orderBy("createdAt", "desc")),
            (results) => {
                const newList = [];
                results.forEach((doc) => {
                    const data = doc.data();
                    data.id = doc.id;
                    newList.push(data);
                });
                setList(newList);
            }
        );
    }, []);
    const onCreateHandler = (e) => {
        if (user === null) {
            e.preventDefault();
            alert("로그인 후 이용해주세요.");
            router.push("/login");
        }
    };
    return (
        <>
            <Table striped>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <Link href={`/articles/${item.id}`}>
                                    {item.subject}
                                </Link>
                            </td>
                            <td>{item.content}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Link href="/create">
                <a onClick={onCreateHandler}>글쓰기</a>
            </Link>
        </>
    );
}
