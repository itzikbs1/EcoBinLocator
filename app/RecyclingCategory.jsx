import { useState, Platform } from "react";
import { Text, View, Button, StyleSheet, Pressable } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import { bins } from './binTypes';
import { Colors } from './Colors'; 



export default function RecyclingCategory({ binTypes }) {

    const [selectedList, setSelectedList] = useState([]);
    const [isListVisible, setIsListVisible] = useState(false);


    const showList = () => {
        setIsListVisible(prev => !prev);
    }
    const handleSelect = (item) => {
        const updatedList = selectedList.includes(item)
            ? selectedList.filter(i => i !== item)
            : [...selectedList, item];

        setSelectedList(updatedList);
        binTypes?.(updatedList)
    }
    // const renderItem = ({ item }) => {
    //     return (
    //         <View style={styles.binItem}>
    //             <Pressable onPress={() => handleSelect(item.value)}>
    //                 <Text
    //                     style={[styles.binText, selectedList.includes(item.value) && styles.selectedText]}
    //                 >
    //                     {selectedList.includes(item.value) ? "✓ " : ""}
    //                     {item.value}
    //                 </Text>
    //             </Pressable>
    //         </View>
    //     )
    // }
    const renderItem = ({ item }) => {
        const isSelected = selectedList.includes(item.value);
        
        return (
          <View style={styles.binItem}>
            <Pressable 
              onPress={() => handleSelect(item.value)}
              style={({pressed}) => [
                styles.binButton,
                pressed && styles.binButtonPressed,
                isSelected && styles.selectedBinButton
              ]}
            >
              <Text style={[
                styles.binText,
                isSelected && styles.selectedText
              ]}>
                {isSelected ? "✓ " : ""}
                {item.value}
              </Text>
            </Pressable>
          </View>
        );
      };
    // return (
    //     <View style={styles.container}>
    //         <Pressable onPress={showList}>
    //             <Text style={styles.text}>
    //                 {selectedList.length === 0
    //                 ? "What you want to recycle?"
    //                 : `${selectedList.join(',')}`}
    //             </Text>
    //         </Pressable>
    //         {isListVisible && (
    //             <Animated.FlatList
    //                 data={bins}
    //                 renderItem={renderItem}
    //                 keyExtractor={(bin) => bin.key.toString()}
    //                 contentContainerStyle={styles.listContainer}
    //                 itemLayoutAnimation={LinearTransition}
    //             />
    //         )}
    //     </View>
    // )
    return (
        <View style={styles.container}>
          <Pressable 
            onPress={showList}
            style={({pressed}) => [
              styles.selector,
              pressed && styles.pressed
            ]}
          >
            <Text style={styles.selectorText}>
              {selectedList.length === 0
                ? "What do you want to recycle?"
                : selectedList.join(', ')}
            </Text>
            <Text style={styles.chevron}>{isListVisible ? '▲' : '▼'}</Text>
          </Pressable>
    
          {isListVisible && (
            <Animated.FlatList
              data={bins}
              renderItem={renderItem}
              keyExtractor={(bin) => bin.key.toString()}
              contentContainerStyle={styles.listContainer}
              itemLayoutAnimation={LinearTransition}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      );
}


const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: Colors.white,
    },
    selector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: Colors.secondary,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    pressed: {
      opacity: 0.8,
    },
    selectorText: {
      fontSize: 16,
      color: Colors.text,
      flex: 1,
    },
    chevron: {
      fontSize: 14,
      color: Colors.text,
      marginLeft: 8,
    },
    listContainer: {
      marginTop: 12,
      backgroundColor: Colors.white,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    binItem: {
      marginVertical: 4,
      marginHorizontal: 8,
    },
    binButton: {
      padding: 16,
      backgroundColor: Colors.secondary,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    selectedBinButton: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
    binText: {
      fontSize: 16,
      color: Colors.text,
    },
    selectedText: {
      color: Colors.white,
      fontWeight: '600',
    },
  });