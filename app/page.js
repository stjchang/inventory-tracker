"use client";

import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";

import { firestore } from "./firebase";
import {
  collection,
  setDoc,
  query,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  count,
} from "firebase/firestore";

import { useEffect, useState, setOpen } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [itemName, setItemName] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data()});
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    //Check if exists
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
      } else {
      await setDoc(docRef, { count: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
      await setDoc(docRef, { count: count - 1 });
      }
    }
    await updateInventory();
  };

  return (
    <Box
      width='100vw'
      height='100vh'
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Add Item
          </Typography>
          <Stack width='100%' direction={"row"} spacing={2}>
            <TextField
              id='outlined-basic'
              label='Item'
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            ></TextField>
            <Button
              variant='contained'
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant='contained' onClick={handleOpen}>
        Add
      </Button>
      <Box border={"1px solid #333"}>
        <Box
          width='800px'
          height='100px'
          bgcolor={"#ADD8E6"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
            Inventory Items
          </Typography>
        </Box>
        <Stack
          width='800px'
          height='400px'
          spacing={2}
          overflow={"auto"}
          border={"1px solid #333"}
        >
          {inventory.map(({name, count}) => (
            <Box
              key={name}
              width='100%'
              minHeight='150px'
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
              paddingX={5}
            >
              <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
                {
                  // Capitalize First Letter
                  name.charAt(0).toUpperCase() + name.slice(1)
                }
              </Typography>
              <Typography variant='h2' color={"#333"} textAlign={"center"}>
                {count}
              </Typography>
              <Stack direction='row' spacing={1}>
                <Button variant='contained' onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant='contained' onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
