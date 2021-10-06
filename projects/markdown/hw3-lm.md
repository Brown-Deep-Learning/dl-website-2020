# HW3: Language Models

Due **Wednesday, 10/23/19 at 11:59pm**

This sentence is words. These words have meaning. How can we make a computer make words with meaning?

We will be building a model that can generate language just as coherent as this as coherent as this as coherent as this is!

## Getting the stencil

You can find the files located here or on the "Files" column under the Assignments page. The files are compressed into a ZIP file, and to unzip the ZIP file, you can just double click on the ZIP file. There should be the files: rnn.py, trigram.py, preprocess.py, README, and data_compressed folder.
You can find the conceptual questions located [here](http://cs.brown.edu/courses/cs1470/projects/public/hw2-cnn/hw2-conceptual-q.pdf) or the "Conceptual Questions" column in the Assignments page.

## Logistics

Work on this assignment off of the stencil code provided, but **do not change the stencil except where specified.** Changing the stencil will result in incompatiblity with the autograder and result in a low grade. You shouldn't change any method signatures.

This assignment has **2 main parts.** You will implement two different types of language model and train them on the modified Wall Street Journal corpus we have provided. They will share a preprocessing file. You must also answer language model conceptual questions.


## The Corpus

When it comes to language modeling, there is a LOT of data out there! In language modeling, we take some set of words, and train our model to predict the next, so almost any large text corpus will do. 

Our data comes from the WSJ corpus, and comprises sentences taken from the newspaper--in fact, if you look at the text, you will see lots of references to finance, stocks, etc. Another thing you will see in the corpus is things that look like this: *UNK-*.

Uncommon words have been *UNKed.* This is a common preprocessing technique to remove rare words, and help the model focus more on learning patterns in general, common language. Because of this 'UNKing' there are no words in the testing corpus that are not in the training corpus!

Lastly, you will notice that each text file has a sentence per line, followed by a 'STOP'. For this assignment, we don't need to worry about where some sentences end and others begin. Thus, in preprocessing, you should concatenate all the words in the sentences together. (Doing this will mean that you can avoid padding and masking, but have no fear--these will figure into our next assignment!).


# Part 0: Preprocessing

Your preprocessing file should contain a get_data() function. This function takes a training file and testing file. 

In this function you should:

Step 1. Load the train words and split the words on whitespace.

Step 2. Loads the test words and split the words on whitespace.

Step 3. Create a vocab dict that maps each word in the corpus to a unique index (its id).

Step 4. Convert the list of training and test words to their indeces, making a 1-d list/array for each

Step 5. Return an iterable of training ids, an iterable of testing ids, and the vocab dict


# Part 1: Trigram Language Model

## Roadmap

In the Trigam Language Model Part of the assignment, you will build a neural network that takes two words and predicts the third. It should do this by looking up the input words in the embedding matrix, and feeding the result into a set of feed-forward layers.

Step 1. Create your model
- Fill out the init function, and define your trainable variables. 
- Fill out the call function using the trainable variables you've created.
- Calculate the softmax cross-entropy loss on the logits compared to the labels (These should NOT be one hot vectors). `We recommend using tf.keras.losses.sparse_categorical_crossentropy`.

Step 2. Train and test
- In the main function, you will want to get your train and test data, initialize your model, and train it for **1 epoch**. We have provided you with a train and test method to fill out. The train method will take in the model and do the forward and backward pass.

## Mandatory Hyperparameters

You must use a single embedding matrix, which you query using tf.nn.embedding_lookup. You should look up the embeddings for your two words, concatenate them, and then feed the result to a few linear layers. Also, remember that there should be a nonlinear function (in our case RelU), applied between the feed-forward layers.
 
Remember that your embedding matrix should store a unique vector for every word in the corpus.
In addition, your call function should return a probability for every word in your vocab.


**While the specifications for your architecture are flexible, your trigram model must train in under 10 minutes on a department machine!**


## Seeing Results
- We've provided a function for you to see text generated from your trained model.


# Part 2: RNN Language Model...with Keras Layers!

Now that we are working with more complex architectures, like LSTMs and GRUs, it's time to add in a little more abstraction. Going forward, unless otherwise specified, you can use [keras layers](https://www.tensorflow.org/api_docs/python/tf/keras/layers) in your model. For these assignment, the relevant layers are: 

- [tf.keras.layers.GRU](https://www.tensorflow.org/api_docs/python/tf/keras/layers/GRU) OR [tf.keras.layers.LSTM](https://www.tensorflow.org/api_docs/python/tf/keras/layers/LSTM) for your RNN

- [tf.keras.layers.Dense](https://www.tensorflow.org/api_docs/python/tf/keras/layers/Dense) for feedforward layers.

You can define this layers in your init, then call them on your inputs in your model.call function.

- Note: Do not use the sequential API.

## Roadmap

Step 1. Create your model
- Fill out the init function, and define your trainable variables. As for trigrams, this will include an embedding matrix. However, for this part assignment, you will now want to define an rnn keras layer, along with dense layers.

**When you define your keras layer, make sure that initialize it with return_sequences=True, return_state=True**

- Fill out the call function using the trainable variables you've created.

**Note that the final state from an LSTM has two components, the last output and cell state. These are the second and third outputs of calling the RNN. If you use a GRU, the final state is the second output returned by the RNN layer.**

Additionally, you may want to include logic for handling when the initial state is None.

- Calculate the average softmax cross-entropy loss on the logits compared to the labels. Again, we suggest using `tf.nn.softmax_cross_entropy_with_logits`.

Step 2. Train and test
- In the main function, you will want to get your train and test data, initialize your model, and train it for **1 epoch**. We have provided for you a train and test method to fill out. The train method will take in the model and do the forward and backward pass.

- **You do not need to worry about passing your hidden state between batches!**

## Mandatory Hyperparameters
While you can train with any batch size, you must use a window size of 20, and can train for at most 1 epoch.

Again, the specifications for this assignment are weak. Your must have an embedding layer, followed by an RNN.

**However, your models must train in under 10 minutes on a department machine!**


## Seeing Results
- We've provided a generation function for this part of the assignment. You can pass your model to this function to see sample generations. If you see lot's of *UNKs*, have no fear! These are common symbols in the corpus.

# Part 3: Conceptual Questions
Fill out conceptual questions and submit in either PDF or .txt format. Submitting a scan of written work is also fine as long as it is readable. Please copy over the questions and write well thought out answers to the questions.

Your README should just contain your accuracy and any bugs you have.

## CS2470 Students

Please complete the CS2470-only conceptual questions **in addition** to the coding assignment and the CS1470 conceptual questions.
 **Note: Questions about 2470 will only be answered on Piazza, or by TAs marked with an asterisk (*) on the calendar.**

# Grading
**Code:** You will be primarily graded on functionality. **Your Trigram model should have a test perplexity < 280, and your RNN model should have a perplexity < 150.**

**Conceptual:** You will be primarily graded on correctness (when applicable), thoughtfulness, and clarity. 


## Autograder
Your model must complete training within 10 minutes for your Trigram Model, and 10 minutes for the RNN.

Our autograder will import your model and your preprocessing functions. We will feed the result of your `get_data` function called on a path to our data and pass the result to your train method in order to return a fully trained model. This will just batch the testing data using YOUR batch size and run it through your model's `call` function. The __logits__ which are returned will then be fed through an accuracy function. In order to ensure you don't lose points, you need to make sure that you... A) correctly return training inputs and labels from `get_data`, B ) ensure that your model's `call` function returns probabilities from the inputs specified, and C) it does not rely on any packages outside of tensorflow, numpy, matplotlib, or the python standard library.

# Handing In

You should submit the assignment using [this Google Form](https://docs.google.com/forms/d/e/1FAIpQLSe8oRO1a1g6iEW3ixpjmtzL9-da4No-ZrOmduZyv7P904LvUw/viewform). You must be logged in with your Brown account. Your assignment.py, preprocess.py, trigam.py, and rnn.py files should be Python files, while the written up conceptual questions should be either of PDF or txt format. The README can be any format.
