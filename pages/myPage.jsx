import Container from "react-bootstrap/Container";
import { auth, db } from "../fBase";
import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function MyPage() {
  return (
    <Container>
      <h3>마이 페이지</h3>
      <div>마이 페이지당</div>
    </Container>
  );
}
