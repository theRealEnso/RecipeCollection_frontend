// AddComponentsScreen.tsx
import { generateUUID } from '@/utils/generateUUID';
import { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View
} from 'react-native';
import CustomButton from './components/CustomButton';
import FormInput from './components/FormInput';

// Types
interface Component {
  id: string;
  name: string;
  ingredients: string[];
}

const AddComponentsScreen = () => {
  const [useMultipleLists, setUseMultipleLists] = useState(false);
  const [defaultIngredients, setDefaultIngredients] = useState<string[]>([]);
  const [defaultIngredientInput, setDefaultIngredientInput] = useState('');
  const [components, setComponents] = useState<Component[]>([]);
  const [newComponentName, setNewComponentName] = useState('');
  const [ingredientInputs, setIngredientInputs] = useState<Record<string, string>>({});

//   const testId = generateUUID();
//   console.log(testId);

  const addDefaultIngredient = () => {
    if (!defaultIngredientInput.trim()) return;
    setDefaultIngredients(prev => [...prev, defaultIngredientInput.trim()]);
    setDefaultIngredientInput('');
  };

  const addComponent = () => {
    if (!newComponentName.trim()) return;
    const newComponent: Component = {
      id: generateUUID(),
      name: newComponentName.trim(),
      ingredients: [],
    };
    setComponents((prev) => [...prev, newComponent]);
    setNewComponentName('');
  };

  const addIngredient = (componentId: string) => {
    const text = ingredientInputs[componentId];
    if (!text?.trim()) return;
    setComponents((prev) =>
      prev.map((c) =>
        c.id === componentId
          ? { ...c, ingredients: [...c.ingredients, text.trim()] }
          : c
      )
    );
    setIngredientInputs((prev) => ({ ...prev, [componentId]: '' }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Ingredients</Text>

      <View style={styles.inputGroup}>
        <Text>Use multiple components?</Text>
        <Switch
          value={useMultipleLists}
          onValueChange={setUseMultipleLists}
        />
      </View>

      {!useMultipleLists ? (
        <View style={styles.componentCard}>
          <Text style={styles.componentTitle}>Ingredients</Text>
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Add ingredient"
              style={styles.input}
              value={defaultIngredientInput}
              onChangeText={setDefaultIngredientInput}
            />
            <CustomButton
              value="+"
              width={40}
              onButtonPress={addDefaultIngredient}
            />
          </View>
          {defaultIngredients.map((item, index) => (
            <Text key={index} style={styles.ingredientItem}>• {item}</Text>
          ))}
        </View>
      ) : (
        <>
          <View style={styles.inputGroup}>
            <FormInput
              placeholder="Component name (e.g. Garam Masala)"
              value={newComponentName}
              onChangeText={setNewComponentName}
            />
            <CustomButton value="Add Component" onButtonPress={addComponent} width={150} />
          </View>

          <FlatList
            data={components}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.componentCard}>
                <Text style={styles.componentTitle}>{item.name}</Text>
                <View style={styles.inputGroup}>
                  <TextInput
                    placeholder="Add ingredient"
                    style={styles.input}
                    value={ingredientInputs[item.id] || ''}
                    onChangeText={(text) =>
                      setIngredientInputs((prev) => ({ ...prev, [item.id]: text }))
                    }
                  />
                  <CustomButton
                    value="+"
                    width={40}
                    onButtonPress={() => addIngredient(item.id)}
                  />
                </View>
                {item.ingredients.map((ing, index) => (
                  <Text key={index} style={styles.ingredientItem}>• {ing}</Text>
                ))}
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

export default AddComponentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    flex: 1,
    marginRight: 10,
  },
  componentCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
  },
  componentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredientItem: {
    fontSize: 14,
    paddingLeft: 10,
  },
});
