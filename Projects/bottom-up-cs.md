### Q/A
1. What is a file in unix?
 - the base abstraction that most things (files, io devices) reduce to for reading/writing

2. What is a file descriptor?
 - Is when we `open` a file and the kernel puts an entry into a the file descriptor table so that the file is routed to appropriate driver for calls (read, write)
 
3. What are the three files it starts with?
 - stdin (0), stdout (1) and stderr (2)
 
4. How do devs make a device a file?
 - register the device with the kernel and provide a virtio_driver that implements the interface for files.
 
5. Differentiate <, >, >> and |
 - >, redirect,  writes to stdin on right
 - >>, redirect append,  writes to stdin on right
 - <, read, copy data into stdin in on left
 - |, pipe, stdout of left into stdin of right
 
6. How does subtraction occur in signed numbers on computers?
 - twos compliment both numbers, add them and subtract 1

### CP1

Concepts: Everything in unix is a file, from an abstraction pov it means that everything can either be read from or written to.   

Abstractions in C looks like the below

```c
#include <stdio.h>
/* The API to implement */
struct greet_api
{
	int (*say_hello)(char *name);
};

/* Our implementation of the hello function */
int say_hello_fn(char *name)
{
	printf("Hello %s\n", name);
	return 0;
}

/* main() doesn't need to know anything about how
 * say_hello works, it just knows that it does */
int main(int argc, char *argv[])
{
	greet_api.say_hello(argv[1]);

	printf("%p, %p, %p\n", greet_api.say_hello, say_hello_fn, &say_hello_fn);

	exit(0);
}

// this expands gracefully to the driver implementation
          /**
 * virtio_driver - operations for a virtio I/O driver
 * @driver: underlying device driver (populate name and owner).
 * @id_table: the ids serviced by this driver.
 * @feature_table: an array of feature numbers supported by this driver.
 * @feature_table_size: number of entries in the feature table array.
 * @probe: the function to call when a device is found.  Returns 0 or -errno.
 * @remove: the function to call when a device is removed.
 * @config_changed: optional function to call when the device configuration
 *    changes; may be called in interrupt context.
 */
struct virtio_driver {
  struct device_driver driver;
  const struct virtio_device_id *id_table;
  const unsigned int *feature_table;
  unsigned int feature_table_size;
  int (*probe)(struct virtio_device *dev);
  void (*scan)(struct virtio_device *dev);
  void (*remove)(struct virtio_device *dev);
  void (*config_changed)(struct virtio_device *dev);
  ONFIG_PM
  int (*freeze)(struct virtio_device *dev);
  int (*restore)(struct virtio_device *dev);
#endif
};
```
#### File Descriptors

File descriptors are the gateway into the kernels abstractions of underlying hardware.

File descriptors are indexes into the file descriptor table stored by the kernel.  The kernel adds an entry in response to an `open` call that also associates the descriptor with the file abstraction provided by the caller.  The file abstraction provides `read`, `write` others

Specifics look more like this
 - devices register themselves with the kernel.  The kernel requires the devices to provide a driver which implements the `virtio_driver` so that generic calls (write, read) can be converted into what the device understands
 - The kernel provides a `file` interface for the devices and puts them in the system as a file.  Normally they end up in a special file system `/dev` these have a major/minor number so that kernel can find the appropriate driver
 - in userland, a `file descriptor` is when we `open` into this special file, kernel finds the appropriate driver to route calls appropriately
 
For non files, it is the same, only there are extra layers in between with the abstraction being the `mount point`.  Mounting it sets up the file system so that the kernel is aware of the underlying device providing storage and files opened under that mount point should be directed to that file system.

When a program starts, it begins with these 3 files

|name|number|?|
|---|---|---|
|stdin (Standard In)|0|Input from keyboard|
|stdout (Standard Out)|1|Output to console|
|stderr (Standard Error)|2|Error Output to console|

#### Shell (bash, zsh, csh)
 - allow you to execute programs
 - redirect files
 - execute concurrently
 - script complete programs

|what|command|what|
|---|---|---| 
|redirect|> (a > b)|take output of a and place it into b|
|redirect append|>> (a >> b)|take output of a and append it into b|
|read|< (a < b)|copy data from b into stdin of a|
|pipe|a\|b|stdout of a into stdin of b|

Pipe's internals are pretty cool.  What it does is
 - instead of associating a file descriptor for stdout to a underlying device (like console)
 - descriptor is pointed to an in memory buffer provided by the kernel commonly called a `pipe`
 - another process can then associate its stdin with the out of the `pipe` buffer to effectively consume its output
 - writes to the `pipe` are stored by the kernel until another process consumes
 - this `buffering` of the `pipe` is a fundamental form of interprocess communication in unix and facilities both data transfer and signaling
 - data transfer is normal piping `ls | grep foo`
 - data signalling `long_process | ls` when ls tries to read the pipe it is empty, so that process will be put to sleep/hibernate until long_process fills up the buffer
 
 ### CP2 Numbers
 
Ascii (american standard computer) is 8 bits to represent all the printable english characters.  Vendors agree that 00000001 means something and printers / video cards can handle printing those things.  Unicode is because there are more than just english, so we need many more bits, which allows for 32 (4 bytes) 

Hexadecimal is because it is hard to convey binary (1000100100) and base 10 would be really unnatural due to the unaligned representation and need for mental conversion.  Hexadecimal is base 16, so can get 4 bits in a single one that uses (A-F0-9)

Ones compliment: Invert the numbers (001 becomes 110, 010 becomes 101)
Twos compliment: Invert the numbers and add 1 (001 becomes 111, 010 becomes 110)

Signed integers on computers are normally represented with twos compliment in order to make addition and subtraction easy.  When you have the twos compliment of a negative number, you can add it to a regular positive number and it will just work.

Floating Points represent decimals using IEEE-754 so that something like 123.45 will be converted into 1.2345 * 10^2 which is represented in bits as Sign (1 bit) significant (1.2345) and exponent(2).  The more significance the higher number of numbers that you can represent. 

```c
{
  float a = 0.45;
  float b = 8.0;  
  double ad = 0.45;
  double bd = 8.0;
  
  printf("float+float, 6dp    : %f\n", a+b);
  printf("double+double, 6dp  : %f\n", ad+bd);
  printf("float+float, 20dp   : %10.20f\n", a+b);
  printf("dobule+double, 20dp : %10.20f\n", ad+bd);
}    
$ ./float

float+float, 6dp    : 8.450000
double+double, 6dp  : 8.450000
float+float, 20dp   : 8.44999998807907104492
dobule+double, 20dp : 8.44999999999999928946
```

```python
>>> 8.0 + 0.45
    8.4499999999999993
```

### CP3 

#### CPU

At it's base level a computer really has a CPU and memory.  The CPU loads instructions from memory, performs operations on them (and, or, xor, sin, add, etc) then stores them back into memory.

An `instruction pointer` keeps track of the nex thing that the CPU needs to do.  In things like loops it will point to the body until the condition is false and then point to the next statement.

Executing a single clock cycle will let one perform a particular event: fetch the instruction, decode the instruction, execute the instruction or store the result.

In order to be faster, the CPU can take multiple paths in a conditional and execute the values eagerly while it waits on another result.  This can possibly be wasted effort if the result changes something that was depended on.  The CPU allows you to provide `memory semantics` in order to declare how strict the instruction sets needs to be.  Those include 
 - release - all instructions after must see result
 - memory barrier/fence - all ops must be committed before continuing

#### Memory

Multi layers: Cache(l1, l2, l3...), Ram, Disk
Normally the faster ones are smaller and closer to CPU where they are needed

Cache Line: The amount of data in a single area of the cache.  A 64b cache line means memory is split into distinct 64b parts

Caches will need to set and handle reading quickly and data that spans multiple caches.  There are 3 types
 - Direct mapped cache: Allow a cache to exist in a single entry in the cache.  It is simple to implement in memory but the cache line 
 - Full Associative: Allows cache to be set in any entry in the cache.  Means each area of cache must be checked
 - Set Associative: Hybrid, caches can exist only in some areas of the cache.

When caches update data in cache they have to decide on a strategy to update underlying main memory
 - Write Through: Update Main memory as cache is updated, slower and more consistent
 - Write Back: Delays writing until absolutely necessary, Faster but Cache Eviction Slower and consistency lower

Memory that can exist in high and lower memory is inclusive, one only being in high memory is exclusive

Memory will have a address which as a tag, index and offset.

