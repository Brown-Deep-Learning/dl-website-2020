# HW1: MNIST Neural Network

Written due **Monday, 09/21/20 [Anywhere on Earth](https://time.is/Anywhere_on_Earth)**

Programming due **Friday, 09/25/20 [Anywhere on Earth](https://time.is/Anywhere_on_Earth)**

Dat boi Blueno has just arrived at a new planet in outer space, but is having trouble understanding the number system. It seems this planet uses a different number system. Blueno wonders: are numbers not just social constructs used to limit and ensure social order? Why do these planet inhabitants subject themselves to this straightjacket of numbers - from number of swipes on Tunder to deadlines, numbers only exist to enforce put people in place. Blueno wants to learn more about this number system but don't know how to recognize any digits. Even worse, Blueno has gone on a few dates but can't pay for the meal when the bill comes! Those poor dates...Blueno needs YOUR help to build a classifier that can recognize digits!

In this assignment, you will be coding a single-layer neural network to classify handwritten digits using only [NumPy](https://docs.scipy.org/doc/numpy/user/quickstart.html).
You will not be using TensorFlow, or any other deep learning framework, for this assignment. **<em>Please read this handout in its entirety before beginning the assignment.</em>**

## Conceptual Questions
Please fill out the conceptual questions on Gradescope under Hw 1 Conceptual Questions: MNIST. You should be able to type in the questions and use LaTeX with $$[LaTeX]$$ or upload photos of written work.

## Getting the Stencil

Please click [here](https://classroom.github.com/a/RVpIq1rH) to get the stencil code. Reference this [guide](https://docs.google.com/document/d/1HnBhzdOGbUrTwh9TaaxrSusn8TObltn3c7FgKjdVImI/edit?usp=sharing) or these [slides](https://docs.google.com/presentation/d/1w_dzls2rfabUrhrQz9f5QU71t7HmLdHJFS8BnHz_q7E/edit?usp=sharing) for more information about GitHub and GitHub Classroom. There are two bash scripts in the root directory of the hw repository, `create_venv.sh` for creating a virtual environment and `download.sh` for downloading the data (if it exists for that homework). You need to run `download.sh` to get the data. However, you do not need to run `create_venv.sh` if you ssh into a department machine and use our course’s public virtual environment instead. You can run a bash script with the command ```./script_name.sh``` (ex: ```./download.sh```).

## Setup

Work on this assignment off of the stencil code provided, but **do not change the stencil except where specified.** Changing the stencil will result in incompatiblity with the autograder and result in a low grade. You shouldn't change any method signatures or add any trainable parameters to __init__ that we don't give you (other instance variables are fine).

Make sure that you are using Python version 3.7+ on this assignment and all future assignments. You can check this in the terminal with:

```bash
python --version
```

Most department machines should have Python 3.7. Please see the installing TensorFlow document for installing Python 3.7 on your local machine. 

This assignment also requires the NumPy and Matplotlib packages. You can install them using pip or run the assignment in a virtual environment. 

To run the virtual environment on a department machine, you can run:

```bash
source /course/cs1470/tf-2.3/bin/activate
```
You can also check out the Python virtual environment guide to set up TensorFlow 2.3 on your local machine.

## Assignment Overview

This task is a multi-classification problem. You will build a one layer neural network to take an image of a handwritten digit and predict its class.

The assignment has **2 parts**. 

Our stencil provides a model class with several methods and hyperparameters you need to use for your network. You will also answer questions related to the assignment and class material. If you are taking 2470, you must also submit another file with your answers to the additional questions. 

You should include a brief README with your model's accuracy and any known bugs.

## Roadmap

For this assignment, we'll walk you through the pipeline of training a neural net, including the structure of the model class and the methods you will have to fill in.

### Step 1. Preprocess the data
Before training a network, you will need to clean your data. This includes retrieving the data, altering the data, and formatting them into the inputs for your network. For this assignment, you will be working on the MNIST dataset. The dataset can be found here: [http://yann.lecun.com/exdb/mnist/
](http://yann.lecun.com/exdb/mnist/), but we have also provided it to you within the ZIP file.

The training data contains 60,000 examples broken into two files: one file contains the image pixel data and the other contains the class label.

You should train your network using **only** the training data and then test your network's accuracy on the testing data. Your program should print its accuracy over the test dataset upon completion.

The MNIST data files are gzipped. You can use the `gzip` library to read these files from Python. To open a gzipped file from Python you can use the following code:
```python
import gzip
with open('file.gz', 'rb') as f, gzip.GzipFile(fileobj=f) as bytestream:
  # bytestream contains the data of the fileobj
  # You can use bytestream.read(n) to read n bytes from the file.
  # If you use bytestream.read(n) twice, 
  # the first call reads the first n bytes, the second reads the second n bytes
```

You might find the function `numpy.frombuffer`  ([https://docs.scipy.org/doc/numpy/reference/generated/numpy.frombuffer.html](https://docs.scipy.org/doc/numpy/reference/generated/numpy.frombuffer.html))
helpful to convert from a buffer of bytes to a NumPy array.
You should normalize the pixel values so that they range from 0 to 1
This can be done by dividing each pixel value by 255 to avoid any numerical overflow issues. Each pixel is exactly 1 byte.

The testing and training data are in the following format:

- `train-images-idx3-ubyte.gz`: 16 byte header, which you should read in and ignore, followed by 60,000 training images. A training example consists of 784 *single-byte* integers (from 0-255) which represent pixel intensities. You will want to read the 16 byte header and then save the rest of the data as the actual training inputs.

- `train-labels-idx1-ubyte.gz`: 8 byte header, which you should read in and ignore, followed by 60,000 training labels. A training label consists of  *single-byte* integers from 0-9 representing the class label. You will want to read the 8 byte header and then save the rest of the data as the actual training labels.

- `t10k-images-idx3-ubyte.gz`: 16 byte header, which you should read in and ignore, followed by 10,000 testing images. You will want to read the 16 byte header and then save the rest of the data as the actual testing inputs.

- `t10k-labels-idx1-ubyte.gz`: 8 byte header, which you should read in and ignore, followed by 10,000 testing labels. You will want to read the 8 byte header and then save the rest of the data as the actual training labels.

*Note*: You can use the data type `np.uint8` for single-byte (or 8-bit) integers. You may have to convert to `np.float32` when preprocessing to normalize the data.

You want the inputs for your model to be batch size of images. Each image is a 28 by 28 matrix of pixel values, but you will have to "flatten" each image into a vector of pixel values of length 784. You might find `numpy.reshape`[https://numpy.org/doc/stable/reference/generated/numpy.reshape.html] to helpful in this process. 

- You will be loading in the dataset in preprocess.py in the function get_data(inputs_file_path, labels_file_path, num_examples)

You will also need fill in the function for batching, get_next_batch(idx, data, labels, batch_size). You will want to return a slice of data and a slice of labels. The slice of data should start at index `idx` in data and be of length `batch_size`. The same goes for the slice of labels. These two slices represent a batch of data and a batch of labels.

### Step 2. Fill in the Model
- Your next step should be to fill out the methods in the model, including all of the TODOs listed in assignment.py. This entails setting your hyperparameters and trainable parameters within the constructor of the model class, filling out the call function (forward pass), calculating the loss, doing back propogation, and writing a function to calculate your model's accuracy.

- Now it's time to fill out the Model class! You should initialize all hyperparameters and trainable parameters in the constructor of the class. Hyperparameters are typically not members of the model class, but doing this is necessary so that when we run your model, we use the exact same hyperparameters you did. Trainable parameters are modified through and through the entirety of training the model (that's what the model is learning!) so it makes sense to initialize this in the Model class.
- For your hyperparameters, we suggest you train all training examples with a learning rate of $\lambda = 0.5$. For your batch size, we recommend using 100. 
- You should initialize a total of 7850 trainable parameters per image. These are the weights $w\_{i, j}$ and the biases $b\_{j}$ where $0 \leq i \leq 783$ and $0 \leq j \leq 9$. All parameters should be initialized to 0.
- Next, you should fill in the Model's `call` function, returning the softmax probabilities for each digit for each image in the batch.
- The `loss` function should implement the cross-entropy loss function. For a given training example, the error $E = -\log(p\_c)$ where $p\_c$ is the probability
of the correct answer in the example. Note that **while you will not directly use the loss for training or updating your parameters in this assignment, printing out the loss will be a very valuable tool in debugging, and you will use the loss to update your parameters in future assignments** 
- You should then fill out the `gradient_descent` and `backpropagation` functions. `gradient_descent` is where you should be calculating your gradients and returning them. `backpropagation` is where you should be applying your gradients with your learning rate. **Do not apply your gradients in the gradient_descent function**. Your calculation of your gradients should take batch size into account by averaging the gradients, and then using that average to update your parameters.
- Lastly you'll want to fill out the `accuracy` function. You'll need to compare the classes your model predicted to the actual labels.
*Note*: You should **NOT** edit the constructor of the Model class to take in any arguments. As mentioned above, everything should be initialized (hard coded) in the constructor.
 - Hint: To improve the model's accuracy, consider using a non-linear activation function. 

### Step 3. Train and test
- Now you'll want to fill out the `train` / `test` functions. In `train` use `get_next_batch` to iterate through all of the training examples, and use your model's functions to calculate the gradients and descend them. In `test` you can get the probabilities by calling the model on the entire testing set at once and then use the accuracy function to get the accuracy of those probabilities.
- Your last step should be to fill out `main` in assignment.py. There you will need to load in the data, create an instance of the Model class, train your model, test your model's accuracy, and visualize the results.

- Now it's time for you to do some Deep Learning!

## Visualizing Results

 We provided the `visualize_loss(losses)` method for you to visualize how your loss changes after each batch using matplotlib, a useful Python library for plotting graphs. **<em>DO NOT EDIT THIS FUNCTION.</em>** You should call this function in train method after you store the loss per batch in an array, which would be passed into this function. This should plot a line graph where the horizontal axis is the i'th batch and the vertical axis is the loss value of the batch.
 
 We've also provided the `visualize_results(image_data, probabilities, image_labels)` method for you to visualize your predictions against the true labels also using matplotlib. This method is currently written with the labels having a shape of [number of images, 1]. **<em>DO NOT EDIT THIS FUNCTION (unless your labels are of shape [number of images, 10]).</em>** You should call this function after training and testing on a set of 10 test images, which you can get by calling get_next_batch(). This should result in a visual of 10 images with your predictions and the actual label written above so you can compare your results! You should do this **last**, after you are sure you have met the benchmark for test accuracy.

## CS2470 Students

Please complete the CS2470-only conceptual questions **in addition** to the coding assignment and the CS1470 conceptual questions.
 **Note: Questions about 2470 will only be answered on Piazza, or by TAs marked with an asterisk (*) on the calendar.**

## Grading and Autograder Compatibility
**Code:** You will be primarily graded on functionality. Your model should have an accuracy that is at least greater than 80% on the testing data.

**While there is no strict time limit for the running this assignment, it can take less than a minute. If it takes more than 5 minutes on a department machine, you are probably doing something incorrectly.**

**Conceptual:** You will be primarily graded on correctness (when applicable), thoughtfulness, and clarity.

**We will test by running your Model class against our test suite**, where we provide the training and testing data. This means that your program has to be able to run without any arguments from the command line, and that it cannot import files as global variables if they are in your local directory. To be clear, we will not be running your main function, but you should ensure that you have implemented your main function correctly such that it will produce the desired output. **We will be running your train and preprocessing functions, so you should make sure that they are implemented correctly.** **Please read the pinned autograding guide on Piazza to ensure that your assignment will pass the autograder.**

## Handing in

You should submit the assignment via Gradescope under the corresponding project assignment by zipping up your hw1 folder. 

**IMPORTANT!** 
1. Please make sure your [insert *.py files students need] are in “hw1/code” this is very important for our autograder to work!
2. DELETE the data folder before you zip up your code, it might be too big to upload to Gradescope

**IF YOU ARE IN 2470: PLEASE REMEMBER TO ADD A BLANK FILE CALLED “2470student” IN THE hw1/code DIRECTORY, WE ARE USING THIS AS A FLAG TO GRADE 2470 SPECIFIC REQUIREMENTS, FAILURE TO DO SO MEANS LOSING POINTS ON THIS ASSIGNMENT**

