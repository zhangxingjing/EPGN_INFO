#include "extcode.h"
#ifdef __cplusplus
extern "C" {
#endif

/*!
 * DLL_tdms_convert_try
 */
void __cdecl DLL_tdms_convert_try(char source_input[], char path_out[], 
	int32_t len);

MgErr __cdecl LVDLLStatus(char *errStr, int errStrLen, void *module);

void __cdecl SetExecuteVIsInPrivateExecutionSystem(Bool32 value);

#ifdef __cplusplus
} // extern "C"
#endif

