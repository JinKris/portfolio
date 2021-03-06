import React, { useState, useContext } from "react";
import { Button, Form, Card, Col, Row } from "react-bootstrap";
import * as Api from "../../api";
import { AwardContext } from "./AwardContext";
import MvpButton from "../../MvpButton";
import aw from "../style/mvpCardBody.module.scss";

const AwardForm = ({
  portfolioOwnerId,
  currentAward,
  setIsEditing,
  setIsAdding,
}) => {
  const [form, setForm] = useState({
    title: currentAward?.title ? currentAward.title : "",
    description: currentAward?.description ? currentAward.description : "",
  });
  const { awards, setAwards } = useContext(AwardContext);
  const handleAwardValue = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (setIsAdding) {
        const userId = portfolioOwnerId;
        await Api.post("award/create", {
          userId,
          title: form.title,
          description: form.description,
        })
          .then(setIsAdding(false))
          .then(
            setAwards([
              ...awards,
              {
                userId,
                title: form.title,
                description: form.description,
              },
            ])
          );
      } else if (setIsEditing) {
        await Api.put(`awards/${currentAward.id}`, {
          userId: currentAward.userId,
          title: form.title,
          description: form.description,
        }).then(setIsEditing(false));
        await Api.get("awardlist", currentAward.userId).then((res) =>
          setAwards(res.data)
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control
          type="text"
          placeholder="수상내역"
          autoComplete="off"
          value={form.title}
          onChange={(e) => handleAwardValue("title", e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Control
          type="text"
          placeholder="상세내역"
          value={form.description}
          onChange={(e) => handleAwardValue("description", e.target.value)}
        />
      </Form.Group>

      <Form.Group as={Row} className="mt-3 text-center mb-4">
        <Col sm={{ span: 20 }}>
          <button className={aw.mvpBtn} type="submit">
            submit
          </button>
          <button
            className={aw.mvpBtn}
            onClick={(e) => {
              setIsAdding ? setIsAdding(false) : setIsEditing(false);
            }}
          >
            cheso
          </button>
        </Col>
      </Form.Group>
    </Form>
  );
};

export default AwardForm;
