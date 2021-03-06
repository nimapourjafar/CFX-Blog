import { css } from "@emotion/css";
import { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AccountContext } from "../context";
import { Conflux } from "js-conflux-sdk";
import { useEffect, useState } from "react";
/* import contract address and contract owner address */
import { contractAddress, ownerAddress } from "../config";

/* import Application Binary Interface (ABI) */
import { abi } from "../../artifacts/contracts/Blog.sol/Blog.json";

export default function Home() {
  /* posts are fetched server side and passed in as props */
  /* see getServerSideProps */
  const [posts, setPosts] = useState(null);
  const account = useContext(AccountContext);

  const router = useRouter();
  async function navigate() {
    router.push("/create-post");
  }

  useEffect(() => {
    async function fetchPosts() {
      if (typeof window !== "undefined" && account) {
        const conflux = new Conflux();

        conflux.provider = window.conflux;
        const contract = conflux.Contract({ abi, address: contractAddress });

        const receipt = await contract
          .fetchPosts()
        console.log("name",receipt);
        setPosts(receipt);
      }
    }
    fetchPosts();
  }, [account]);

  return (
    <div>
      <div className={postList}>
        {posts &&
          /* map over the posts array and render a button with the post title */
          posts.map((post, index) => (
            <Link href={`/post/${post[2]}`} key={index}>
              <a>
                <div className={linkStyle}>
                  <p className={postTitle}>{post[1]}</p>
                </div>
              </a>
            </Link>
          ))}
      </div>
      <div className={container}>
        {account === ownerAddress && posts && !posts.length && (
          /* if the signed in user is the account owner, render a button */
          /* to create the first post */
          <button className={buttonStyle} onClick={navigate}>
            Create your first post
            <img src="/right-arrow.svg" alt="Right arrow" className={arrow} />
          </button>
        )}
      </div>
    </div>
  );
}

const arrowContainer = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-right: 20px;
`;

const postTitle = css`
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
  margin: 0;
  padding: 20px;
`;

const linkStyle = css`
  border: 1px solid #ddd;
  margin-top: 20px;
  border-radius: 8px;
  display: flex;
`;

const postList = css`
  width: 700px;
  margin: 0 auto;
  padding-top: 50px;
`;

const container = css`
  display: flex;
  justify-content: center;
`;

const buttonStyle = css`
  margin-top: 100px;
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 44px;
  padding: 20px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

const arrow = css`
  width: 35px;
  margin-left: 30px;
`;

const smallArrow = css`
  width: 25px;
`;
