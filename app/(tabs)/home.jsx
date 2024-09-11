import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View, TouchableOpacity } from "react-native";
import { images,icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import { EmptyState, SearchInput, Trending, VideoCard } from "../../components";
import {  signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";


const Home = () => {
  
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  // one flatlist
  // with list header
  // and horizontal flatlist

  //  we cannot do that with just scrollview as there's both horizontal and vertical scroll (two flat lists, within trending)

  return (
    <SafeAreaView className="bg-white">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pblack text-sm text-black">
                  Bienveido
                </Text>
               
              </View>


              <View className="mt-1.5">
              <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
             
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.lpc}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                
              </Text>

           <Trending posts={latestPosts ?? []} /> 
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
           <View className="flex-1 justify-center items-center bg-gray-200">
          <Text className="text-2xl font-bold text-gray-800">Bienvenido</Text>
          <View className="mt-4 flex flex-row items-center">
            <Image className="w-20 h-20 rounded-full"/>
            <View className="ml-1">
              <Text className="text-lg font-bold text-gray-800">Un Placer Tenerte De Nuevo</Text>
            </View>
          </View>
        </View> 
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
