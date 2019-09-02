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
 
  
 