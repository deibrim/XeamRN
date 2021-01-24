import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { useNavigation } from "@react-navigation/native";
import { firestore } from "../../firebase/firebase.utils";

import styles from "./styles";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
const SuggestFeatureScreen = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [reported, setReported] = useState(false);
  const [issues, setIssues] = useState([]);

  const navigation = useNavigation();
  const onReport = useCallback(() => {
    setReported(true);
    wait(2000).then(() => setReported(false));
  }, []);
  useEffect(() => {
    fetchSuggestions();
  }, []);
  async function fetchSuggestions() {
    const snapshot = await firestore.collection("featureSuggestions").get();
    const suggestionArr = [];
    snapshot.docs.forEach((item) => {
      suggestionArr.push(item.data());
      if (suggestionArr.length === snapshot.docs.length) {
        console.log(suggestionArr.length, snapshot.docs.length);
        setIssues(suggestionArr);
      }
    });
  }
  const onPostSuggestion = async () => {
    setLoading(true);
    const id = uuidv4().split("-").join("");
    if (suggestion.trim() === "") {
      return;
    }
    try {
      const newSuggestion = {
        id,
        feature: suggestion,
        userID: currentUser.id,
        username: currentUser.username,
        votes: {},
        count: 0,
      };
      firestore.collection("featureSuggestions").doc(id).set(newSuggestion);
      setLoading(false);
      setSuggestion("");
      onReport();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="ios-arrow-back"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.title}>Back</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={{ ...styles.title, fontSize: 14 }}>Suggest Feature</Text>
      </View>

      <View style={styles.container}>
        <TextInput
          value={suggestion}
          onChangeText={setSuggestion}
          numberOfLines={5}
          placeholder={"Write your suggestion"}
          style={styles.textInput}
        />
        {reported ? (
          <View style={{ ...styles.centerContainer, opacity: 0.7 }}>
            <Text style={{ fontSize: 18, color: "#111111" }}>
              Thanks for your support!
            </Text>
          </View>
        ) : null}
        <View style={styles.trendingIssues}>
          <View style={[styles.trendingIssuesHead, { borderBottomWidth: 0 }]}>
            <Text
              style={[
                styles.trendingIssuesHeadText,
                { textTransform: "none", fontSize: 15, fontWeight: "500" },
              ]}
            >
              Upvote an existing suggestion if it matches with the one you're
              suggesting
            </Text>
          </View>
          <View style={styles.trendingIssuesHead}>
            <Text style={styles.trendingIssuesHeadText}>Trending Features</Text>
          </View>
          <View style={styles.issues}>
            <FlatList
              contentContainerStyle={{}}
              scrollEnabled={false}
              snapToInterval={Dimensions.get("screen").width}
              snapToAlignment={"start"}
              decelerationRate={"fast"}
              data={issues}
              initialScrollIndex={0}
              initialNumToRender={3}
              keyExtractor={(item, index) => index.toString()}
              renderItem={(item) => <FeaturePreview feature={item.item} />}
            />
          </View>
        </View>
        <TouchableOpacity onPress={onPostSuggestion}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Post Suggestion</Text>
            {loading && (
              <Image
                style={{ marginTop: 2, marginLeft: 5, width: 18, height: 18 }}
                source={require("../../assets/loader.gif")}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SuggestFeatureScreen;

function FeaturePreview({ feature }) {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [hasVoted, setHasVoted] = useState(
    feature.votes[currentUser.id] === true
  );
  const [voteCount, setvoteCount] = useState(0);
  useEffect(() => {
    getVotesCount();
  }, [voteCount]);
  function getVotesCount() {
    const count = Object.values(feature.votes).filter((v) => v).length;
    setvoteCount(count);
  }
  const onUpVote = () => {
    const currentUserId = currentUser.id;
    const hasVoted = feature.votes[currentUser.id] === true;
    if (hasVoted) {
      feature.votes[currentUserId] = false;
      let votes = feature.votes;
      setvoteCount(voteCount - 1);
      firestore
        .collection("featureSuggestions")
        .doc(feature.id)
        .update({ count: voteCount - 1, votes });
      setHasVoted(!hasVoted);
    } else if (!hasVoted) {
      feature.votes[currentUserId] = true;
      let votes = feature.votes;
      setvoteCount(voteCount + 1);
      firestore
        .collection("featureSuggestions")
        .doc(feature.id)
        .update({ count: voteCount + 1, votes });
      setHasVoted(!hasVoted);
    }
  };
  return (
    <View style={styles.FeaturePreview}>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#222222",
              textTransform: "uppercase",
            }}
          >
            {voteCount} Upvote{voteCount > 1 && "s"}
          </Text>
          <TouchableOpacity style={styles.iconContainer} onPress={onUpVote}>
            <AntDesign
              name={hasVoted ? "like1" : "like2"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{ fontSize: 14, color: "#222222" }}>{feature.feature}</Text>
    </View>
  );
}
