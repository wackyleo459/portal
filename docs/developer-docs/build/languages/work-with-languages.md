# Develop using different languages

Most of the example dapps in this guide use Motoko—the programming language specifically designed to work with the IC. Potentially, however, you can write dapps in any language that compiles to WebAssembly to deploy applications that run on the IC. This section provides some high-level guidance for writing dapps in different languages and how to deploy them on the IC.

## Using Rust

You can create Rust projects to run on the IC by using Cargo and compiling your dapp to use WebAssembly as the target output.

This section provides a summary of the key steps involved in deploying a Rust program as a canister on the IC. You should note, however, that the steps described here only illustrate one approach. Other implementation approaches are also possible.

Note that the [Rust canister development kit (Rust CDK)](https://github.com/dfinity/cdk-rs) provides some shortcuts to make it easier to write functions as query and update calls and includes several [examples](https://github.com/dfinity/cdk-rs/tree/next/examples) to get you started building Rust-based projects, but you can also develop dapps for the IC without using the Rust CDK.

### Create a project

Because most Rust programmers use Cargo to handle build and package management tasks, such as downloading and compiling the libraries your dapp depends on, your first step is to create a new Rust project using the Cargo command-line interface.

Alternatively, you could create a new project using SDK instead of Cargo, but creating a project using Cargo represents the typical workflow for creating Rust projects.

To create a new Rust project:

1.  Open a terminal shell on your local computer, if you don’t already have one open.

2.  Verify that you have Cargo installed by running the following command:

        cargo --version

3.  Change to the folder you are using for your IC or Rust sample projects.

4.  Create a new project by running a command similar to the following:

        cargo new my_rust_dapp

    This command creates a new `my_rust_dapp` directory with a default `Cargo.toml` file and a `src` directory with a default `main.rs` file.

5.  Change to your project directory by running the following command:

        cd my_rust_dapp

    If you list the contents of this directory, you’ll see that it only contains the `Cargo.toml` file and `src` directory. To compile this project to run on the IC, you’ll need some additional files.

### Modify the Cargo configuration file

The `Cargo.toml` file provides a **manifest** for each Rust package. The manifest contains sections that specify configuration details for the package. To prepare the Rust project to run on the IC, we’ll copy the default `Cargo.toml` file then modify some of the configuration details for the project.

To modify the `Cargo.toml` file:

1.  Check that you are in the root directory for your project by running the `pwd` command, if necessary.

2.  Copy the default `Cargo.toml` file to the `src` directory by running the following command:

        cp Cargo.toml src/Cargo.toml

    Projects that run on the IC typically use one project-level `Cargo.toml` file to set up a workspace for the canister members of the project and a second `Cargo.toml` file in the source code directory to configure settings for each canister.

3.  Open the `Cargo.toml` file that is the root directory of your project in a text editor.

    By default, the file contains the `[package]` and the `[dependencies]` sections.

4.  Replace the `[package]` section with a `[workspace]` section similar to the following:

        [workspace]
        members = [
            "src/my_rust_dapp",
        ]

    For information about the `[workspace]` section and `[workspace]` keys, see [Workspaces](https://doc.rust-lang.org/cargo/reference/workspaces.html). For information about the other sections and keys you can configure in the `Cargo.toml` file, see [The Manifest Format](https://doc.rust-lang.org/cargo/reference/manifest.html).

5.  Remove the `[dependencies]` section.

6.  Save your changes and close the file to continue.

7.  Open the `src/Cargo.toml` file in a text editor.

8.  Add a `[lib]` section with the path to the main source code similar to the following:

        [lib]
        path = "main.rs"

9.  Update the `[dependencies]` section with any package dependencies.

10. Save your changes and close the file to continue.

### Add a canister configuration file

When you create a new project using the SDK, the `dfx new` command automatically adds a default `dfx.json` configuration file to the project directory. Because we created the Rust project using Cargo, you need to manually create this file in your project directory.

To add the `dfx.json` configuration file:

1.  Check that you are still in your project directory by running the `pwd` command, if necessary.

2.  Create a new `dfx.json` configuration file in the root directory for your project.

3.  Open the `dfx.json` file in a text editor.

4.  Add the `version` and `canisters` keys with settings similar to the following to the `dfx.json` file:

        {
          "version": 1,
          "canisters": {
            "my_rust_dapp": {
              "type": "custom",
              "candid": "src/my_rust_dapp.did",
              "wasm": "target/wasm32-unknown-unknown/debug/my_rust_dapp.wasm",
              "build": "cargo build --target wasm32-unknown-unknown --package my_rust_dapp"
            }
          }
        }

    Let’s take a closer look at these settings.

    -   The `version` setting is used to identify the version of the software used to create the project.

    -   The `canisters` section specifies the name of the project’s canisters. In this case, there’s only one canister and it is named `my_rust_dapp`.

    -   The `type` key is set to `custom` because this canister is not one of the currently recognized (`motoko` or `assets`) canister types.

    -   The `candid` key specifies the name and location of the Candid interface description file to use for this project.

    -   The `wasm` key specifies the path to the WebAssembly file generated by the `cargo build` command.

    -   The `build` key specifies the `cargo` command used to compile the output.

    These are the minimum settings required. As you build more complex programs, you might need to include additional configuration details in the `Cargo.toml` file, the `dfx.json` file, or both files.

5.  Save your changes and close the file to continue.

### Create a Candid interface description file

In addition to the `dfx.json` configuration file, you need to have a Candid interface description file—for example, `my_rust_dapp.did`—to map your dapp’s input parameters and return value formats to their language-agnostic representation in Candid.

To add the Candid interface description file:

1.  Check that you are still in your project directory by running the `pwd` command, if necessary.

2.  Create a new Candid interface description file—for example, `my_rust_dapp.did`—in the `src` directory for your project.

3.  Open the Candid interface description file in a text editor and add a description for each function the dapp defines.

    For example, if the `my_rust_dapp` is a simple dapp that increments a counter using the `increment`, `read`, and `write` functions, the `my_rust_dapp.did` file might look like this:

        service : {
          "increment": () -> ();
          "read": () -> (nat) query;
          "write": (nat) -> ();
        }

4.  Save your changes and close the file to continue.

### Modify the default dapp

When you create a new project, your project `src` directory includes a template `main.rs` file with the "Hello, World!" program.

To modify the template source code:

1.  Open the template `src/main.rs` file in a text editor and delete the existing content.

2.  Write the program you want to deploy on the IC.

    As you write your program, keep in mind that there are two types of calls—update calls and query calls—and that update functions use asynchronous messaging.

3.  Save your changes and close the `main.rs` file.

### Deploy the dapp

Before you can deploy and test your dapp, you need to do the following:

-   Connect to either the local canister execution environment, or to the IC blockchain mainnet.

-   Register a network-specific identifier for the application.

-   Compile the dapp with a target output of WebAssembly.

Because you configured the custom `dfx.json` file with a `cargo build` command that compiles to WebAssembly, you can use the `dfx` command-line interface and standard work flow to perform all of the remaining steps.

To build and deploy the dapp locally:

1.  Check that you are still in your project directory by running the `pwd` command, if necessary.

2.  Open a new terminal window or tab on your local computer and navigate to your project directory.

    For example, you can do either of the following if running Terminal on macOS:

    -   Click **Shell**, then select **New Tab** to open a new terminal in your current working directory.

    -   Click **Shell** and select **New Window**, then run `cd ~/ic-projects/location_hello` in the new terminal if your `location_hello` project is in the `ic-projects` working folder.

    You should now have two terminals open with your project directory as your current working directory\*\*.

3.  Start the local canister execution environment by running the following command:

        dfx start

    Depending on your platform and local security settings, you might see a warning displayed. If you are prompted to allow or deny incoming network connections, click **Allow**.

4.  Leave the terminal that displays network operations open and switch your focus to your original terminal where you created your project.

5.  Register a unique canister identifier for the application by running the following command:

        dfx canister create --all

6.  Build the dapp by running the following command:

        dfx build

7.  Deploy the dapp on the local canister execution environment by running the following command:

        dfx canister install --all

8.  Test functions in the dapp from the command-line or in a browser.

## Using C

Because the IC supports dapps compiled to standard WebAssembly modules, you can use standard compilers and toolchains to build applications in languages such as C, C++, Objective-C, and Objective-C++ programming languages and the `Clang` compiler.

To illustrate how to migrate dapps written in C to run on the IC, let’s look at the simple `reverse.c` program in the [examples](https://github.com/dfinity/examples/tree/master/c) repository. The `reverse.c` program contains one function—named `go`—that reverses a string in place.

### Set up the development environment

To compile the `reverse.c` program into WebAssembly, you need to have the `clang` compiler and standard libraries installed. You can check whether you have `clang` installed on your local computer by running the following command:

    clang --version

If `clang` is installed, the command displays information similar to the following:

    clang version 10.0.0
    Target: x86_64-apple-darwin19.5.0
    Thread model: posix
    InstalledDir: /usr/local/opt/llvm/bin

If the command doesn’t return version information, install `clang` before continuing. The steps to install `clang` vary depending on the operating system you are using. On Debian Linux, for example, run the following command:

    sudo apt-get install clang lld gcc-multilib

On macOS, you can install `clang` by installing the Developer Command-Line Tools or by installing LLVM using Homebrew. For example, if `clang` is not installed, run the following command:

    brew install llvm

### Compile the program into WebAssembly

You can compile a C program to run as a WebAssembly module by first compiling using `clang`, then linking using `wasm-ld`. Depending on the operating system and version of `clang` you are using, you might use a different version of the WebAssembly linker, such as `wasm-ld` on macOS or `wasm-ld-8` on Debian.

To compile to WebAssembly on macOS:

1.  Compile the program by running the following clang command:

        clang --target=wasm32 -c -O3 reverse.c

2.  Run the linker to create the WebAssembly module by running the following `wasm-ld` command:

        wasm-ld --no-entry --export-dynamic --allow-undefined reverse.o -o reverse.wasm

### Create a minimal configuration file

Next, you need to prepare a simple configuration file that identifies the `reverse` dapp binary as a package that can be installed on the IC and a `build` directory so that you can use the `dfx` command-line interface to install and run the package as a canister.

To prepare a configuration file and build directory:

1.  Create a `dfx.json` file with a canisters key by running the following command:

        echo '{"canisters":{"reverse":{"main":"reverse"}}}' > dfx.json

2.  Create a `build` directory for the dapp by running the following command:

        mkdir build

3.  Create a `reverse` directory for the dapp by running the following command:

        mkdir build/reverse

4.  Copy the WebAssembly modules to the new `build/reverse` directory by running the following command:

        cp reverse.wasm build/reverse/

### Create a minimal interface description file

In a standard development workflow, running the `dfx build` command creates several files in the `canisters` output directory, including one or more Candid interface description (`.did`) files that handle type matching for the data types associated with a program’s functions.

For details about the syntax to use for different data types, see the [*Candid Guide*](./candid/candid-intro) and [Candid specification](https://github.com/dfinity/candid/tree/master/spec).

To create a Candid interface description file for this program:

1.  Open a terminal in the `build` directory you created for the `reverse.c` program source

2.  Create a new text file named `reverse.did`.

3.  Add a description of the `go` function.

    For example:

        service : {
          "go": (text) -> (text);
        }

4.  Save your changes and close the file to continue.

### Deploy and test the dapp

Before you can deploy and test your dapp, you need to do the following:

-   Connect to either the local canister execution environment, or to the IC blockchain mainnet.

-   Register a network-specific identifier for the application.

To deploy and test the dapp locally:

1.  Open a new terminal window or tab on your local computer.

    For example, if running Terminal on macOS,click **Shell**, then select **New Tab** to open a new terminal in your current working directory.

2.  Start the local canister execution environment in your second terminal by running the following command:

        dfx start

3.  Register a unique canister identifier for the `reverse` application by running the following command:

        dfx canister create --all

4.  Deploy the default dapp on the local canister execution environment by running the following command:

        dfx canister install --all

5.  Call the `go` function in the dapp by running the following command:

        dfx canister call reverse go reward
        ("drawer")

You can find additional examples of C dapps in the [examples](https://github.com/dfinity/examples/tree/master/c) repository.
