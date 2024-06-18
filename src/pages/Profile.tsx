<<<<<<< HEAD
import { useState } from "react";
import { useEffect } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Button,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Box,
  Divider,
  Link,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ProfilePosts from "../components/Profile/ProfilePosts";
import axios from "axios";
import ProfileReplies from "../components/Profile/ProfileReplies";
import ProfileLikes from "../components/Profile/ProfileLikes";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CakeIcon from "@mui/icons-material/Cake";
import { useNavigate, useParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton/IconButton";
import Layout from "./Layout";
import SideBar from "../components/SideBar/SideBar";
import { Link as Routerlink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import FollowingButton from "../components/Common/FollowingButton";
import FollowButton from "../components/Common/FollowButton";
import EditProfileModal from "../components/Profile/EditProfileModal";
import { setDisplayName } from "../state/slices/userSlice";
import { updateDisplayNames } from "../state/slices/postsSlice";

const styles = {
  avatar: {
    border: "5px solid white",
    boxSizing: "border-box",
    height: "140px",
    marginTop: "-15%",
    width: "140px",
  },
  avatarContainer: {
    alignItems: "flex-start",
    display: "flex",
    justifyContent: "space-between",
  },
  banner: {
    width: "100%",
    height: "200px",
    backgroundColor: "primary.main",
  },
  bio: { paddingTop: 1 },
  displayName: { fontWeight: 700 },
  editProfileButton: {
    fontWeight: "bold",
    color: "black.main",
    minWidth: "84px",
    ":hover": {
      backgroundColor: "primary.light",
    },
  },
  followerCount: { fontWeight: "bold" },
  followerContainer: { paddingTop: 1, display: "flex", gap: 3 },
  header: {
    alignItems: "center",
    display: "flex",
    gap: 2,
    padding: 1,
  },
  nameContainer: { paddingTop: 1 },
  personalInfo: {
    alignItems: "center",
    display: "flex",
    color: "gray.dark",
    gap: 2,
    paddingTop: 1,
  },
  personalInfoContent: { display: "flex", gap: 0.5 },
  profileContent: { padding: 2 },
  tab: {
    ":hover": {
      backgroundColor: "primary.light",
    },
    transitionDuration: "0.25s",
  },
  username: { fontSize: 16 },
};

export type EditableProfileContents = Pick<
  ProfileContent,
  "bio" | "birthDate" | "displayName"
>;

export type ProfileContent = {
  bio?: string;
  birthDate?: string;
  displayName: string;
  followerCount: number;
  followingCount: number;
  followStatus: boolean;
  joinedDate: string;
  postCount: number;
  userId?: number;
  username: string;
};

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { username } = useParams();
  const [value, setValue] = useState("one");
  const currentUserId = useAppSelector((state) => state.user.userId);
  const [profileContents, setProfileContents] = useState<ProfileContent>({
    bio: "",
    birthDate: undefined,
    displayName: "",
    followerCount: 0,
    followingCount: 0,
    followStatus: false,
    joinedDate: "",
    postCount: 0,
    username: "",
  });
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchProfileContents = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          "http://localhost:3001/api/profile/getProfileContents",
          {
            params: {
              currentUserId,
              visitedUsername: username,
            },
          }
        );
        setProfileContents({
          ...result.data,
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchProfileContents();
    window.scrollTo(0, 0);
  }, [username]);

  // TODO: Make date utility functions or use a library for date formatting
  const formatJoinedDate = (joinedDateString: string) => {
    const joinedDateObj = new Date(joinedDateString);
    const joinedMonth = joinedDateObj.toLocaleString("default", {
      month: "long",
    });
    const joinedYear = joinedDateObj.getFullYear();
    return `${joinedMonth} ${joinedYear}`;
  };

  const formatBirthDate = (birthDateString: string) => {
    const birthDateObj = new Date(birthDateString);
    return birthDateObj.toLocaleString("default", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Layout
        middleContent={
          <Box>
            <Box sx={styles.header}>
              <IconButton onClick={() => navigate(-1)}>
                <KeyboardBackspaceIcon color="secondary" />
              </IconButton>
              <Box>
                <Typography variant="h3">
                  {profileContents.displayName}
                </Typography>
                <Typography variant="subtitle2">
                  {profileContents.postCount} Posts
                </Typography>
              </Box>
            </Box>
            <Box>
              <Box sx={styles.banner} />
              <Box sx={styles.profileContent}>
                <Box sx={styles.avatarContainer}>
                  <Avatar sx={styles.avatar} />
                  {!loading &&
                    profileContents.userId &&
                    (profileContents.userId === currentUserId ? (
                      <Button
                        onClick={() => setEditProfileModalOpen(true)}
                        startIcon={<EditIcon />}
                        size="small"
                        sx={styles.editProfileButton}
                        variant="outlined"
                      >
                        Edit Profile
                      </Button>
                    ) : profileContents.followStatus ? (
                      <FollowingButton
                        onClick={() => {
                          setProfileContents({
                            ...profileContents,
                            followStatus: false,
                            followerCount: --profileContents.followerCount,
                          });
                        }}
                        visitedUserId={profileContents.userId}
                      />
                    ) : (
                      <FollowButton
                        onClick={() => {
                          setProfileContents({
                            ...profileContents,
                            followStatus: true,
                            followerCount: ++profileContents.followerCount,
                          });
                        }}
                        visitedUserId={profileContents.userId}
                      />
                    ))}
                </Box>
                <Box sx={styles.nameContainer}>
                  <Typography variant="h3" sx={styles.displayName}>
                    {profileContents.displayName}
                  </Typography>
                  <Typography variant="subtitle2" sx={styles.username}>
                    @{profileContents.username}
                  </Typography>
                </Box>
                {profileContents.bio && (
                  <Typography sx={styles.bio}>{profileContents.bio}</Typography>
                )}
                <Box sx={styles.personalInfo}>
                  <Box sx={styles.personalInfoContent}>
                    <CalendarMonthIcon />
                    <Typography>
                      Joined {formatJoinedDate(profileContents.joinedDate)}
                    </Typography>
                  </Box>
                  {profileContents.birthDate && (
                    <Box sx={styles.personalInfoContent}>
                      <CakeIcon />
                      <Typography>
                        Born {formatBirthDate(profileContents.birthDate)}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={styles.followerContainer}>
                  <Link
                    color={theme.palette.black.main}
                    component={Routerlink}
                    to={`/${username}`} // TODO: Create Modal to check followers
                    underline="hover"
                  >
                    <Typography component="span" sx={styles.followerCount}>
                      {profileContents.followerCount}
                    </Typography>
                    <Typography component="span"> Followers</Typography>
                  </Link>
                  <Link
                    color={theme.palette.black.main}
                    component={Routerlink}
                    to={`/${username}`} // TODO: Create Modal to check following
                    underline="hover"
                  >
                    <Typography component="span" sx={styles.followerCount}>
                      {profileContents.followingCount}
                    </Typography>
                    <Typography component="span"> Following</Typography>
                  </Link>
                </Box>
              </Box>
            </Box>
            <Tabs
              centered
              component="nav"
              onChange={(_, newValue: string) => setValue(newValue)}
              value={value}
              variant="fullWidth"
            >
              <Tab value="one" label="Posts" sx={styles.tab} />
              <Tab value="two" label="Replies" sx={styles.tab} />
              <Tab value="three" label="Likes" sx={styles.tab} />
            </Tabs>
            <Divider />
            {!loading && profileContents.userId && (
              <Box>
                {value === "one" && (
                  <ProfilePosts userId={profileContents.userId} />
                )}
                {value === "two" && (
                  <ProfileReplies userId={profileContents.userId} />
                )}
                {value === "three" && (
                  <ProfileLikes userId={profileContents.userId} />
                )}
              </Box>
            )}
          </Box>
        }
        rightContent={<SideBar />}
      />
      {!loading && editProfileModalOpen && (
        <EditProfileModal
          bio={profileContents.bio}
          birthDate={profileContents.birthDate}
          displayName={profileContents.displayName}
          onClose={() => setEditProfileModalOpen(false)}
          onSubmit={(editedProfile: EditableProfileContents) => {
            dispatch(setDisplayName(editedProfile.displayName));
            dispatch(
              updateDisplayNames({
                prevDisplayName: profileContents.displayName,
                newDisplayName: editedProfile.displayName,
              })
            );
            setProfileContents({ ...profileContents, ...editedProfile });
          }}
          open={editProfileModalOpen}
        />
      )}
    </>
  );
};

export default Profile;
=======
import { useState } from "react";
import { useEffect } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Button,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Box,
  Divider,
  Link,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ProfilePosts from "../components/Profile/ProfilePosts";
import axios from "axios";
import ProfileReplies from "../components/Profile/ProfileReplies";
import ProfileLikes from "../components/Profile/ProfileLikes";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CakeIcon from "@mui/icons-material/Cake";
import { useNavigate, useParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton/IconButton";
import Layout from "./Layout";
import SideBar from "../components/SideBar/SideBar";
import { Link as Routerlink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import FollowingButton from "../components/Common/FollowingButton";
import FollowButton from "../components/Common/FollowButton";
import EditProfileModal from "../components/Profile/EditProfileModal";
import { setDisplayName } from "../state/slices/userSlice";
import { updateDisplayNames } from "../state/slices/postsSlice";
import FollowListModal from "../components/Profile/FollowListModal";

const styles = {
  avatar: {
    border: "5px solid white",
    boxSizing: "border-box",
    height: "140px",
    marginTop: "-15%",
    width: "140px",
  },
  avatarContainer: {
    alignItems: "flex-start",
    display: "flex",
    justifyContent: "space-between",
  },
  banner: {
    width: "100%",
    height: "200px",
    backgroundColor: "primary.main",
  },
  bio: { paddingTop: 1 },
  displayName: { fontWeight: 700 },
  editProfileButton: {
    fontWeight: "bold",
    color: "black.main",
    minWidth: "84px",
    ":hover": {
      backgroundColor: "primary.light",
    },
  },
  followerCount: { fontWeight: "bold" },
  followerContainer: { paddingTop: 1, display: "flex", gap: 3 },
  header: {
    alignItems: "center",
    display: "flex",
    gap: 2,
    padding: 1,
  },
  nameContainer: { paddingTop: 1 },
  personalInfo: {
    alignItems: "center",
    display: "flex",
    color: "gray.dark",
    gap: 2,
    paddingTop: 1,
  },
  personalInfoContent: { display: "flex", gap: 0.5 },
  profileContent: { padding: 2 },
  tab: {
    ":hover": {
      backgroundColor: "primary.light",
    },
    transitionDuration: "0.25s",
  },
  username: { fontSize: 16 },
};

export type EditableProfileContents = Pick<
  ProfileContent,
  "bio" | "birthDate" | "displayName"
>;

export type ProfileContent = {
  bio?: string;
  birthDate?: string;
  displayName: string;
  followerCount: number;
  followingCount: number;
  followStatus: boolean;
  joinedDate: string;
  postCount: number;
  userId?: number;
  username: string;
};

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { username } = useParams();
  const [value, setValue] = useState("one");
  const currentUserId = useAppSelector((state) => state.user.userId);
  const [profileContents, setProfileContents] = useState<ProfileContent>({
    bio: "",
    birthDate: undefined,
    displayName: "",
    followerCount: 0,
    followingCount: 0,
    followStatus: false,
    joinedDate: "",
    postCount: 0,
    username: "",
  });
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [followList, setFollowList] = useState([]);
  const [listType, setListType] = useState("followers"); // 'followers' or 'following'

  // const handleOpenFollowers = async () => {
  //   // const followers = await fetchFollowers(); // Implement this
  //   // setFollowList(followers);
  //   // setListType("followers");
  //   setOpenModal(true);
  //   console.log({ openModal });
  // };

  // const handleOpenFollowing = async () => {
  //   // const following = await fetchFollowing(); // Implement this
  //   // setFollowList(following);
  //   // setListType("following");
  //   setOpenModal(true);
  //   console.log({ openModal });
  // };

  useEffect(() => {
    setLoading(true);
    const fetchProfileContents = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          "http://localhost:3001/api/profile/getProfileContents",
          {
            params: {
              currentUserId,
              visitedUsername: username,
            },
          }
        );
        setProfileContents({
          ...result.data,
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchProfileContents();
    window.scrollTo(0, 0);
  }, [username]);

  // TODO: Make date utility functions or use a library for date formatting
  const formatJoinedDate = (joinedDateString: string) => {
    const joinedDateObj = new Date(joinedDateString);
    const joinedMonth = joinedDateObj.toLocaleString("default", {
      month: "long",
    });
    const joinedYear = joinedDateObj.getFullYear();
    return `${joinedMonth} ${joinedYear}`;
  };

  const formatBirthDate = (birthDateString: string) => {
    const birthDateObj = new Date(birthDateString);
    return birthDateObj.toLocaleString("default", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Layout
        middleContent={
          <Box>
            <Box sx={styles.header}>
              <IconButton onClick={() => navigate(-1)}>
                <KeyboardBackspaceIcon color="secondary" />
              </IconButton>
              <Box>
                <Typography variant="h3">
                  {profileContents.displayName}
                </Typography>
                <Typography variant="subtitle2">
                  {profileContents.postCount} Posts
                </Typography>
              </Box>
            </Box>
            <Box>
              <Box sx={styles.banner} />
              <Box sx={styles.profileContent}>
                <Box sx={styles.avatarContainer}>
                  <Avatar sx={styles.avatar} />
                  {!loading &&
                    profileContents.userId &&
                    (profileContents.userId === currentUserId ? (
                      <Button
                        onClick={() => setEditProfileModalOpen(true)}
                        startIcon={<EditIcon />}
                        size="small"
                        sx={styles.editProfileButton}
                        variant="outlined"
                      >
                        Edit Profile
                      </Button>
                    ) : profileContents.followStatus ? (
                      <FollowingButton
                        onClick={() => {
                          setProfileContents({
                            ...profileContents,
                            followStatus: false,
                            followerCount: --profileContents.followerCount,
                          });
                        }}
                        visitedUserId={profileContents.userId}
                      />
                    ) : (
                      <FollowButton
                        onClick={() => {
                          setProfileContents({
                            ...profileContents,
                            followStatus: true,
                            followerCount: ++profileContents.followerCount,
                          });
                        }}
                        visitedUserId={profileContents.userId}
                      />
                    ))}
                </Box>
                <Box sx={styles.nameContainer}>
                  <Typography variant="h3" sx={styles.displayName}>
                    {profileContents.displayName}
                  </Typography>
                  <Typography variant="subtitle2" sx={styles.username}>
                    @{profileContents.username}
                  </Typography>
                </Box>
                {profileContents.bio && (
                  <Typography sx={styles.bio}>{profileContents.bio}</Typography>
                )}
                <Box sx={styles.personalInfo}>
                  <Box sx={styles.personalInfoContent}>
                    <CalendarMonthIcon />
                    <Typography>
                      Joined {formatJoinedDate(profileContents.joinedDate)}
                    </Typography>
                  </Box>
                  {profileContents.birthDate && (
                    <Box sx={styles.personalInfoContent}>
                      <CakeIcon />
                      <Typography>
                        Born {formatBirthDate(profileContents.birthDate)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={styles.followerContainer}>
                  <Link
                    color={theme.palette.black.main}
                    component={Routerlink}
                    to={`/${username}`} // TODO: Create Modal to check followers
                    underline="hover"
                    onClick={() => setOpenModal(true)}
                  >
                    <Typography component="span" sx={styles.followerCount}>
                      {profileContents.followerCount}
                    </Typography>
                    <Typography component="span"> Followers</Typography>
                  </Link>
                  <Link
                    color={theme.palette.black.main}
                    component={Routerlink}
                    to={`/${username}`} // TODO: Create Modal to check following
                    underline="hover"
                    onClick={() => setOpenModal(true)}
                  >
                    <Typography component="span" sx={styles.followerCount}>
                      {profileContents.followingCount}
                    </Typography>
                    <Typography component="span"> Following</Typography>
                  </Link>
                </Box>

                {/* Created Modal to check for followers/following */}
                <FollowListModal
                  openModal={openModal}
                  onClose={() => {
                    setOpenModal(false);
                    console.log(openModal);
                  }}
                />
              </Box>
            </Box>
            <Tabs
              centered
              component="nav"
              onChange={(_, newValue: string) => setValue(newValue)}
              value={value}
              variant="fullWidth"
            >
              <Tab value="one" label="Posts" sx={styles.tab} />
              <Tab value="two" label="Replies" sx={styles.tab} />
              <Tab value="three" label="Likes" sx={styles.tab} />
            </Tabs>
            <Divider />
            {!loading && profileContents.userId && (
              <Box>
                {value === "one" && (
                  <ProfilePosts userId={profileContents.userId} />
                )}
                {value === "two" && (
                  <ProfileReplies userId={profileContents.userId} />
                )}
                {value === "three" && (
                  <ProfileLikes userId={profileContents.userId} />
                )}
              </Box>
            )}
          </Box>
        }
        rightContent={<SideBar />}
      />
      {!loading && editProfileModalOpen && (
        <EditProfileModal
          bio={profileContents.bio}
          birthDate={profileContents.birthDate}
          displayName={profileContents.displayName}
          onClose={() => setEditProfileModalOpen(false)}
          onSubmit={(editedProfile: EditableProfileContents) => {
            dispatch(setDisplayName(editedProfile.displayName));
            dispatch(
              updateDisplayNames({
                prevDisplayName: profileContents.displayName,
                newDisplayName: editedProfile.displayName,
              })
            );
            setProfileContents({ ...profileContents, ...editedProfile });
          }}
          open={editProfileModalOpen}
        />
      )}
    </>
  );
};

export default Profile;
>>>>>>> 167c027 (Created a FollowLIstModal Component)
