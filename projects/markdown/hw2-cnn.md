# HW2: CIFAR2: Convolutional Neural Networks

Due **Friday, 10/11/19 at 11:59pm**

Through the eons, humans have interrogated the universe's many fundamental questions. How did we come to be? What comprises a "good" life? From whence can a sentient being derive meaning?

Of these many questions, one stands alone in its ability to evade consesus and vex the brightest thinkers.

Of course, it is....**Which are better: Cats or Dogs?**

We will not be able to answer such an intractable question in this short assignment. However, we can work towards our goal in earnest by tackling a simpler subproblem. **We will learn to tell them apart.**

In this assignment, you will be building a Convolutional Neural Network (CNN) with pooling layers using the CIFAR dataset.  **<em>Please read this handout in its entirety before beginning the assignment.</em>**

## Getting the stencil

You can find the files located here or on the "Files" column under the Assignments page. The files are compressed into a ZIP file, and to unzip the ZIP file, you can just double click on the ZIP file. There should be the files: assignment.py, convolution.py, preprocess.py, README, and CIFAR_data_compressed folder.
You can find the conceptual questions located [here](http://cs.brown.edu/courses/cs1470/projects/public/hw2-cnn/hw2-conceptual-q.pdf) or the "Conceptual Questions" column in the Assignments page.

## Logistics

Work on this assignment off of the stencil code provided, but **do not change the stencil except where specified.** Changing the stencil will result in incompatiblity with the autograder and result in a low grade. You shouldn't change any method signatures or add any trainable parameters to __init__ that we don't give you (other instance variables are fine).

**This assignment should take longer than the previous assignment. If completed correctly, the model should train and test within 10 minutes on a department machine.** While you will mainly be using TensorFlow functions, the second part of the assignment requires you to write your own convolution function, which is very computationally expensive. To counter this, we only require that you print the accuracy across the test set after finishing all training. On a local machine, training using TensorFlow functions may take about 5 minutes, and testing using your own convolution function may take upwards of 10 minutes. On a department machine, training should take about 3 minutes and testing using your own convolution should take about 2 minutes.

This assignment requires the TensorFlow, NumPy, and Matplotlib packages. You can install them using pip or run the assignment in a virtual environment. 

To run the virtual environment on a department machine, you can run:

```bash
source /course/cs1470/tf-2.0/bin/activate
```
You can also check out the Python virtual environment guide to set up TensorFlow 2.0 on your local machine.

## CIFAR2, not CIFAR10

Your task is a binary classification problem. While the CIFAR10 dataset has 10 possible classes (airplane, automobile, bird, cat, deer, frog, horse, ship, and truck), you will build a CNN to take in an image and correctly predict its class to either be a cat or dog, hence CIFAR2. We limit this assignment to a binary classification problem so that you can train the model in a reasonable amount of time.

The assignment has **3 parts**. 

Our stencil provides a model class with several methods and hyperparameters you need to use for your network. You will also fill out a function that performs the convolution operator. You will also answer a questions related to the assignment and class material as part of this assignment.

# Part 1: The Model

## Roadmap

You will notice that the structure of the Model class is very similar to the Model class defined in your first assignment. **We strongly suggest that you first complete the Intro to TensorFlow Lab before starting this assignment.** The lab includes many explanations about the way a Model class is structured, what variables are, and how things work in TensorFlow. If you come into hours with questions about TensorFlow related material that is covered in the lab, we will direct you to the lab.

Below is a brief outline of some things you should do. We expect you to fill in some of the missing gaps (review lecture slides to understand the pipeline) as this is your second assignment.

Step 1. Preprocess the data
- We have provided you with a function `unpickle(file)` in the preprocess file stencil, which unpickles an object and returns a dictionary. Do not edit it. We have already extracted the inputs and the labels from the pickled file into a dictionary for you, as you can see within `get_data`. 
- You will want to limit the inputs and labels returned by `get_data` to those representing the first and second classes of your choice. For every image and its corresponding label, if the label is not of the first or second class, then remove the image and label from your inputs and labels arrays. 
- At this point, your inputs are still two dimensional. You will want to reshape your inputs into (-1, 3, 32, 32) using `tf.reshape(inputs, (-1, 3, 32 ,32))` and then transpose them so that the final inputs you return have shape (num_examples, 32, 32, 3).
- Recall that the label of your first class might be something like 5, representing a dog in the CIFAR dataset, but you will want to turn that to a 0 since this is binary classification problem. Likewise, for all images of the second class, say a cat, you will want to turn those labels to a 1.
- After doing that, you will want to turn your 0s and 1s to one hot vectors, where the index with a 1 represents the class of the correct image. You can do this with the function `tf.one_hot(labels, depth=2)`.
- This is be a bit confusing so we'll just make it clear: **your labels should be of size (num_images, num_classes).** So for the first example, the corresponding label might be [0, 1] where a 1 in the second index means that it's a cat/dog/hamster/sushi.

Step 2. Create your model
- **You will not receive credit if you use the tf.keras, tf.layers, and tf.slim libraries.**
- Again, you should initialize all hyperparameters within the constructor even though this is not customary. This is still necessary for the autograder. Consider what's being learned in a CNN and intialize those as trainable parameters. In the last assignment, it was our weights and biases. This time around, you will still want weights and biases, but there are other things that are being learned!
- We recommend using an Adam Optimizer \[`tf.train.AdamOptimizer`\] with a learning rate of 1e-3, but feel free to experiment with whatever produces the best results.
- Weight variables should be initialized from a normal distribution
    (`tf.truncated_normal`) with a standard deviation of 0.1.
- You may use any permutation and number of convolution, pooling, and feed forward layers, as long as you **use at least one convolution layer with strides of [1, 1, 1, 1], one pooling layer, and one fully connected layer.**
- If you are having trouble getting started with model architecture, we have provided an example below:
    - Convolution Layer 1 \[`tf.nn.conv2d`\]
        - 16 filters of width 5 and height 5
        - strides of 2 and 2
        - same padding
    - Batch Normalization 1 \[`tf.nn.batch_normalization`\]
        - Get the mean and variance using \[`tf.nn.moments`\]
    - ReLU Nonlinearlity 1 \[`tf.nn.relu`\]
    - Max Pooling 1 \[`tf.nn.max_pool`\]
        - kernels of width 3 and height 3
        - strides of 2 and 2
    - Convolution Layer 2
        - 20 filters of width 5 and height 5
        - strides of 1 and 1
        - same padding
    - Batch Normalization 2
    - ReLU Nonlinearlity 2
    - Max Pooling 2
        - kernels of width 2 and height 2
        - strides of 2 and 2
    - Convolution Layer 3
        - 20 filters of width 5 and height 5
        - strides of 1 and 1
        - same padding
    - Batch Normalization 3
    - ReLU Nonlinearlity 3
    - Dense Layer 1
        - Dropout with rate 0.3
    - Dense Layer 2
        - Dropout with rate 0.3
    - Dense Layer 3
- Fill out the call function using the trainable variables you've created. Note that in the lab, we mentioned using a @tf.function decorator to tell TF to run it in graph execution. Do NOT do this for this assignment - we'll explain why the forward pass has to be run in eager execution later. The parameter `is_testing` will be used in Part 2, do not worry about it when implementing everything in this part.
- Calculate the average softmax cross-entropy loss on the logits compared to the labels. We suggest using `tf.nn.softmax_cross_entropy_with_logits`.

Step 4. Train and test
- In the main function, you will want to get your train and test data, initialize your model, and train it for many epochs. We suggest training for 10 epochs. For the autograder, we will train it for at most 25 epochs (hard limit 10 of minutes). We have provided for you a train and test method to fill out. The train method will take in the model and do the forward and backward pass for a SINGLE epoch. Yes, this means that, unlike the first assignment, your `main` function will have a for loop that goes through the number of epochs, calling train each time.
- Even though this is technically part of preprocessing, you should shuffle your inputs and labels when TRAINING. Keep in mind that they have to be shuffled in the same order. We suggest creating a range of indices of length num_examples, then using `tf.random.shuffle(indices)`. Finally you can use `tf.gather(train_inputs, indices)` to shuffle your inputs. You can do the same with your labels to ensure they are shuffled the same way.
- **You should also reshape the inputs into (batch_size, width, height, in_channels) before calling model.call().** When training, you might find it helpful to actually call `tf.image.random_flip_left_right` on your batch of image inputs to increase accuracy. Do not call this when testing.
- Call the model's forward pass and calculate the loss within the scope of `tf.GradientTape`. Then use the model's optimizer to apply the gradients to your model's trainable variables outside of the GradientTape. If you're unsure about this part, please refer to the lab. This is synonymous with doing the `gradient_descent` function in the first assignment, except that TensorFlow handles all of that for you!
- If you'd like, you can calculate the train accuracy to check that your model does not overfit the training set. If you get upwards of 80% accuracy on the training set but only 65% accuracy on the testing set, you might be overfitting.
- The test method will take in the same model, now with trained parameters, and return the accuracy given the test data and test labels. 
- At the very end, we have written a method for you to visualize your results. The visualizer will not be graded but you can use it to check out your doggos and kittens.
- Your README can just contain your accuracy and any bugs you have.

### Mandatory Hyperparameters
You can train with any batch size but you are limited to training for at most 25 epochs (I know, the title of this section is a bit misleading). **However, your model must train using TensorFlow functions and test using your own convolution function within 10 minutes on a department machine. We will be timing this when autograding.** Again, the parameters we suggest are training for 25 epochs using a batch size of 64.

### Reading in the Data
The CIFAR files are pickled objects. We have provided you with a function `unpickle(filename)`. You should not edit it. *Note:* You should normalize the pixel values so that they range from 0 to 1
(This can easily be done by dividing each pixel value by 255) to avoid any numerical overflow issues.

### Data format
The testing and training data files to be read in are in the following format:

`train`: A pickled object of 50,000 train images and labels. This includes images and labels of all 10 classes. After unpickling the file, the dictionary will have the following elements:
- data -- a 50000x3072 numpy array of uint8s. Each row of the array stores a 32x32 colour image. The first 1024 entries contain the red channel values, the next 1024 the green, and the final 1024 the blue. The image is stored in row-major order, so that the first 32 entries of the array are the red channel values of the first row of the image.
- labels -- a list of 50000 numbers in the range 0-9. The number at index i indicates the label of the ith image in the array data.
- Note that if you download the dataset from online, the training data is actually divided into batches. We have done the job of repickling all of the batches into one single train file for your ease.

`test`: A pickled object of 10,000 test images and labels. This includes images and labels of all 10 classes. Unpickling the file gives a dictionary with the same key values as above.

We've already done the job of unpickling the file and have extracted the unprocessed inputs and labels in the `get_data` function.

To get only the images and labels of classes 3 and 5 (representing dog and cat), you will want to loop over the data and only add it to your result array of inputs and labels if they belong to those classes.

## Visualizing Results
- We've provided the `visualize_results(image_data, probabilities, image_labels, first_label, second_label)` method for you to visualize your predictions against the true labels using matplotlib, a useful Python library for plotting graphs. This method is currently written with the image_labels having a shape of (num_images, num_classes). **<em>DO NOT EDIT THIS FUNCTION.</em>** You should call this function after training and testing, passing into into `visualize_results` an input of 10 images, 10 probabilities, 10 labels, the first label name, and second label name. 
- Unlike the first assignment, you will need to pass in the strings of the first and second classes. A `visualize_results` method call might look like: `visualize_results(image_inputs, probabilities, image_labels, "cat", "dog")`. 
- This should result in a visual of 10 images with your predictions and the actual label written above so you can compare your results! You should do this after you are sure you have met the benchmark for test accuracy.

# Part 2: Conv2d

Before starting this part of the assignment, **you should ensure that you have an accuracy of at least 70%** on the test set using only TensorFlow functions for the problem of classifying dogs and cats.

As a new addition to this assignment, you will be implementing your very own convolution function! Deep Learning == TensorFlow tutorial no more!

For the sake of simple math calculations (less is more, no?), we'll require that our `conv2d` function **only works with a stride of 1** (for both width and height). This is because the calculation for padding size changes as a result of the stride, which would be way more complex and unreasonable for a second assignment.

Do **NOT** change the parameters of the conv2d function we have provided. Even though the `conv2d` function takes in a strides argument, you should **ALWAYS** pass in [1, 1, 1, 1]. Leaving in strides as an argument was a conscious design choice - if you wanted to eventually make the conv2d function work for other kinds of strides in your own time, this would allow you to easily change it.

## Roadmap
- Your inputs will have 4 dimensions. If we are to use this `conv2d` function for the first layer, the inputs would be [batch_size, in_height, in_width, input_channels]. 
- You should ensure that the input's number of "in channels" is equivalent to the filters' number of "in channels". Make sure to add an assert statement or throw an error if the number of input in channels are not the same as the filters in channels. You will lose points if you do not do this.
- If padding is the same, you will have to determine a padding size. Luckily, for strides of 1, padding is just `(filter_size - 1)/2`. The derivation for this formula is out of the scope of this course, but if you are interested, you may read about it [here](http://cs231n.github.io/convolutional-networks/).
- You can use this hefty NumPy function `np.pad` to padd your input!
- After padding (if needed), you will want to go through the entire batch of images and perform the convolution operator on each image. There are two ways of going about this - you can continuously append to multi dimensional NumPy arrays to an output array or you can create a NumPy array with the correct output dimensions, and just update each element in the output as you perform the convolution operator. We suggest doing the latter - it's conceptually easier to keep track of things this way. 
- Your output dimension height is equal to `(in_height + 2*padY - filter_height) / strideY + 1` and your output dimension width is equal to `(in_width + 2*padX - filter_width) / strideX + 1`. Refer to the slides if you'd like to understand this derivation.
- You will want to iterate the entire height and width including padding, stopping when you cannot fit a filter over the rest of the padding input. For convolution with many input channels, you will want to perform the convolution per input channel and sum those dot products together.

Testing out your own `conv2d`:
- We have provided for you a few tests that compare the result of your very own `conv2d` and TensorFlow's `conv2d`. If you've implemented it correctly, the results should be very similar.
- **The last super important part of this project is that you should call your `conv2d` function IN your model.** TensorFlow cannot build a graph/differentiate with NumPy operators so you should not add a @tf.function decorator.
- In your model, you should set `is_testing` to True when testing, then make sure that if `is_testing` is True, you use your own convolution rather than TensorFlow's `conv2d` on a **SINGLE** convolution layer. If you follow the architecture described above, we suggest adding in an if statement before the third convolution layer (ie. switch out the `conv2d` for your third convolution). This part will take the longest, and is why we say it might actually take up to 15 minutes on a local machine.

## Autograder
Your model must complete training within 10 minutes AND under 25 epochs on a department machines. For CS2470 students, the limit is 10 epochs.

Our autograder will import your model and your preprocessing functions. We will feed the result of your `get_data` function called on a path to our data and pass the result to your train method in order to return a fully trained model. After this, we will feed in your trained model, alongside the TA pre-processed data, to our custom test function. This will just batch the testing data using YOUR batch size and run it through your model's `call` function. **However, we will test that your model can test with any batch size, meaning that you should not harcode `self.batch_size` in your `call` function.** The __logits__ which are returned will then be fed through an accuracy function. In order to ensure you don't lose points, you need to make sure that you... A) correctly return training inputs and labels from `get_data`, B ) ensure that your model's `call` function returns logits from the inputs specified, and that it does not break on different batch sizes when testing, and C) it does not rely on any packages outside of tensorflow, numpy, matplotlib, or the python standard library.

# Part 3: Conceptual Questions
Fill out conceptual questions and submit in either PDF or .txt format. Submitting a scan of written work is also fine as long as it is readable. Please copy over the questions and write well thought out answers to the questions.

## Grading
**Code:** You will be primarily graded on functionality. Your model should have an accuracy that is at least greater than 70% on the testing data.

**Conceptual:** You will be primarily graded on correctness (when applicable), thoughtfulness, and clarity. 

**You will not receive credit if you use the tf.keras, tf.layers, and tf.slim libraries.**

## CS2470 Students

There are two extra requirements for CS2470 students.

1. Please complete the CS2470-only conceptual questions **in addition** to the coding assignment and the CS1470 conceptual questions.
 **Note: Questions about 2470 will only be answered on Piazza, or by TAs marked with an asterisk (*) on the calendar.**

2. **You must receive an accuracy of at least 70% within 10 epochs of training your model.** This means that you must choose an architecture/play around with hyperparameters to reach an accuracy that is of 70% in a shorter amount of time.

## Handing In

You should submit the assignment using [this Google Form](https://docs.google.com/forms/d/e/1FAIpQLSe8oRO1a1g6iEW3ixpjmtzL9-da4No-ZrOmduZyv7P904LvUw/viewform). You must be logged in with your Brown account. Your assignment.py, preprocess.py, and convolution.py files should be Python files, while the written up conceptual questions should be either of PDF or txt format. The README can be any format.

## Cats vs. Dogs?

"I am currently neither, and I have been both in the past" - Daniel Ritchie

"Definitely a dog person. In fact I’m allergic to cats" - David Oyeka

"I’m a dog. But I am a cat person" - Zach Horvitz

"I'm a big time doggo" - Brian Oppenheim

"I feel like I'm neither dog or cat. I'm a bull" - Amy Pu (I'm actually a huge dog person)

<p><img style="height:150px" src="https://media3.giphy.com/media/yNrO4XhUNf0zK/giphy.gif"><img style="height:150px" src="https://media1.giphy.com/media/Rh3C5O8eLkr04/source.gif"><img style="height:150px" src="https://media2.giphy.com/media/j2Fwurg6KtC2Q/source.gif"><img style="height:150px" src="https://media1.giphy.com/media/RvsgIECoRvKuI/source.gif"></p>