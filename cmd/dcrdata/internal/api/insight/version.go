package insight

// APIVersion is an integer value, incremented for breaking changes
type APIVersion uint32

const currentAPIVersion = 1

var supportedAPIVersions = []APIVersion{
	currentAPIVersion,
}
