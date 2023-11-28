# DebugTShow

A VSCode(ium) extension to get instant feedback by plotting PyTorch tensors when selecting them during a debug session. 
The addon is using [torchshow](https://github.com/xwying/torchshow) to plot the tensor.

[demo.webm](https://github.com/HugoTini/DebugTShow/assets/65409496/87ebc784-9dc3-440c-90d7-bffef6a1131e)

## Install

1) Make sure [torchshow](https://github.com/xwying/torchshow) is installed in your python project : `pip install torchshow`.

2) Download the latest `.vsix` from the [release page](https://github.com/HugoTini/DebugTShow/releases).

3) In VSCode / VSCodium, in the extensions panel menu, click ___Install from VSIX___ and select the downloaded extension.

## Usage

See video above,

1) Start a debug session in your PyTorch project and pause it (for e.g. with a breakpoint).

2) Double click on a tensor or select a valid expression (that resolves to a tensor). The tensor must be in a format that [torchshow](https://github.com/xwying/torchshow) can recognize.

Notes :

- If the expression is valid and resolves to a tensor that torchshow is able to plot, it will be displayed. Otherwise, it will silently fail and will not update the image. To display error messages, use the commands `DebugTShow: Debug Messages Disable` & `DebugTShow: Debug Messages Enable`. Leave it disabled when not needed.

- The selected text can be anything, comments included. It can be useful to add temporary debug plot snippets (see video above).

- To quickly disable / enable the extension, use the commands `DebugTShow: Disable` & `DebugTShow: Enable` (or completely disable / uninstall it from the extension panel).

- The displayed image is saved in  `_torchshow/`. If using git, it is recommended to add this folder to your `.gitignore`.

## License

This uses code from [vscode-debug-visualizer](https://github.com/hediet/vscode-debug-visualizer). This repo is also under [GPL](./LICENSE.md).
