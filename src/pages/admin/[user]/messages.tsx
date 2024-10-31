import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Navbar from "@/components/navbar";
import Messages from "@/components/admin/user/messages";

const inter = Inter({ subsets: ["latin"] });

export default function Layout() {
	return (
		<div className="flex flex-row">
			<Messages />
		</div>
	);
}
